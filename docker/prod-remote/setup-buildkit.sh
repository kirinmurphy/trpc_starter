#!/usr/bin/env bash
set -euo pipefail

case "$(uname -s)" in
  Linux) ;;
  *) echo "unsupported host"; exit 1 ;;
esac
command -v systemctl >/dev/null 2>&1 || { echo "systemd required"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "docker required"; exit 1; }
command -v jq >/dev/null 2>&1 || true


BUILDX_VERSION="${BUILDX_VERSION:-v0.16.2}"
PLUGIN_DIR="${HOME}/.docker/cli-plugins"
DAEMON_JSON="/etc/docker/daemon.json"
BUILDER_NAME="${BUILDER_NAME:-builder}"
ENABLE_SWAP="${ENABLE_SWAP:-1}"
SWAP_GB="${SWAP_GB:-2}"
SWAPFILE="${SWAPFILE:-/swapfile}"

need_sudo() {
  if [ "$(id -u)" -ne 0 ]; then sudo -n true >/dev/null 2>&1 || { echo "sudo required"; exit 1; }; fi
}

install_buildx() {
  mkdir -p "${PLUGIN_DIR}"
  arch="$(uname -m)"
  case "$arch" in
    x86_64|amd64) asset="linux-amd64" ;;
    aarch64|arm64) asset="linux-arm64" ;;
    *) echo "unsupported arch: ${arch}"; exit 1 ;;
  esac
  url="https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.${asset}"
  curl -fsSL "${url}" -o "${PLUGIN_DIR}/docker-buildx"
  chmod +x "${PLUGIN_DIR}/docker-buildx"
  docker buildx version >/dev/null
}

enable_buildkit_daemon() {
  sudo mkdir -p /etc/docker
  tmp="$(mktemp)"
  if [ -f "${DAEMON_JSON}" ]; then
    cp "${DAEMON_JSON}" "${DAEMON_JSON}.bak.$(date +%s)"
    if command -v jq >/dev/null 2>&1; then
      jq '.features = (.features // {}) | .features.buildkit = true' "${DAEMON_JSON}" > "${tmp}" || echo '{"features":{"buildkit":true}}' > "${tmp}"
    else
      echo '{"features":{"buildkit":true}}' > "${tmp}"
    fi
  else
    echo '{"features":{"buildkit":true}}' > "${tmp}"
  fi
  sudo mv "${tmp}" "${DAEMON_JSON}"
  sudo systemctl restart docker
}

create_builder() {
  docker buildx inspect "${BUILDER_NAME}" >/dev/null 2>&1 || docker buildx create --name "${BUILDER_NAME}" --driver docker-container --use
  docker buildx inspect --bootstrap >/dev/null
}

set_env_global() {
  if grep -q '^DOCKER_BUILDKIT=' /etc/environment 2>/dev/null; then
    sudo sed -i 's/^DOCKER_BUILDKIT=.*/DOCKER_BUILDKIT=1/' /etc/environment
  else
    echo 'DOCKER_BUILDKIT=1' | sudo tee -a /etc/environment >/dev/null
  fi
  export DOCKER_BUILDKIT=1
}

ensure_swap() {
  [ "${ENABLE_SWAP}" = "1" ] || return 0
  if swapon --show | grep -q "${SWAPFILE}"; then
    return 0
  fi
  if [ ! -f "${SWAPFILE}" ]; then
    size="${SWAP_GB}G"
    if command -v fallocate >/dev/null 2>&1; then
      sudo fallocate -l "${size}" "${SWAPFILE}" || true
    fi
    if [ ! -s "${SWAPFILE}" ]; then
      sudo dd if=/dev/zero of="${SWAPFILE}" bs=1M count=$((SWAP_GB*1024)) status=none
    fi
    sudo chmod 600 "${SWAPFILE}"
    sudo mkswap "${SWAPFILE}" >/dev/null
  fi
  sudo swapon "${SWAPFILE}" || true
  grep -q "^${SWAPFILE} " /etc/fstab 2>/dev/null || echo "${SWAPFILE} none swap sw 0 0" | sudo tee -a /etc/fstab >/dev/null
}

verify() {
  docker buildx version
  docker buildx ls
  free -m || true
  swapon --show || true
}

main() {
  need_sudo
  install_buildx
  enable_buildkit_daemon
  create_builder
  set_env_global
  ensure_swap
  verify
}

main "$@"
