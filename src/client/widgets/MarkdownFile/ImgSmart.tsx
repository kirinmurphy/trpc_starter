import { useMemo, useState } from 'react';
import { baseDir, ensureSlash } from './utils';

export function ImgSmart(props: any) {
  const { src, markdownUrl, linkedFileRootPath, ...rest } = props;
  const options = useMemo(
    () => imgCandidates(src || '', markdownUrl, linkedFileRootPath),
    [src, markdownUrl, linkedFileRootPath]
  );
  const [idx, setIdx] = useState(0);
  return (
    <img
      {...rest}
      src={options[idx]}
      onError={() => {
        if (idx + 1 < options.length) setIdx(idx + 1);
      }}
    />
  );
}

function imgCandidates(
  src: string,
  markdownUrl: string,
  linkedFileRootPath?: string
) {
  const origin = new URL(window.location.origin);
  const clean = src.replace(/^\.?\//, '');
  if (/^(https?:|data:)/.test(src)) return [src];
  const list: string[] = [];
  if (src.startsWith('/')) list.push(new URL(src, origin).toString());
  const root = ensureSlash(linkedFileRootPath);
  if (root) {
    const rootBase = root.startsWith('http')
      ? new URL(root)
      : new URL(root, origin);
    list.push(new URL(clean, rootBase).toString());
  }
  const dir = baseDir(markdownUrl);
  list.push(new URL(src, dir).toString());
  list.push(new URL(`docs/${clean}`, origin).toString());
  return uniq(list);
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
