export function baseDir(markdownUrl: string) {
  const origin = new URL(window.location.origin);
  const u = new URL(markdownUrl, origin);
  return new URL('.', u);
}

export function ensureSlash(s?: string) {
  if (!s) return s;
  return s.endsWith('/') ? s : `${s}/`;
}
