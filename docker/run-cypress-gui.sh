#!/bin/bash

echo "🚀 Starting Cypress GUI setup..."

# Function to install X11 utilities based on OS
install_x11() {
  case "$(uname -s)" in
    Darwin*)
      echo "📱 macOS detected"
      # First check if XQuartz is already installed via brew
      if brew list --cask | grep -q xquartz; then
        echo "✅ XQuartz already installed"
      else
        echo "Installing XQuartz..."
        brew install --cask xquartz
        echo "⚠️  First install detected. Please log out and back in"
        exit 1
      fi
      
      # Ensure XQuartz binaries are in PATH
      export PATH="/opt/X11/bin:$PATH"
      
      # Check if xhost is now available
      if ! command -v xhost &> /dev/null; then
        echo "❌ xhost command not found. Please ensure XQuartz is properly installed"
        echo "Try opening XQuartz manually first: open -a XQuartz"
        exit 1
      fi
      ;;
    Linux*)
      echo "🐧 Linux detected"
      if ! command -v xhost &> /dev/null; then
        echo "Installing X11 utilities..."
        if [ -f /etc/debian_version ]; then
          sudo apt-get update && sudo apt-get install -y x11-xserver-utils
        elif [ -f /etc/fedora-release ]; then
          sudo dnf install -y xorg-x11-server-utils
        else
          echo "❌ Unsupported Linux distribution"
          exit 1
        fi
      fi
      ;;
    *)
      echo "❌ Unsupported operating system"
      exit 1
      ;;
  esac
}

# Function to setup display
setup_display() {
  if [ -z "$DISPLAY" ]; then
    case "$(uname -s)" in
      Darwin*)
        # Ensure XQuartz is running
        if ! pgrep -x "Xquartz" > /dev/null; then
          echo "Starting XQuartz..."
          open -a XQuartz
          sleep 3  # Give XQuartz time to start
        fi
        export DISPLAY=:0
        ;;
      Linux*)
        export DISPLAY=:1
        ;;
    esac
  fi
  echo "📺 Display set to: $DISPLAY"
}

# Function to verify X11 setup
verify_x11() {
  if ! xhost &> /dev/null; then
    echo "❌ X11 setup failed. Please ensure XQuartz is running"
    echo "Try these steps:"
    echo "1. Open XQuartz manually: open -a XQuartz"
    echo "2. In XQuartz preferences, ensure 'Allow connections from network clients' is checked"
    echo "3. Log out and log back in"
    exit 1
  fi
}

# Main execution
install_x11
setup_display
verify_x11

echo "🔒 Enabling X11 forwarding..."
xhost +local:docker

echo "🚀 Starting Cypress..."
docker compose -f docker-compose.cypress-gui.yml up

# Cleanup on exit
trap 'echo "🧹 Cleaning up X11 permissions..." && xhost -local:docker' EXIT