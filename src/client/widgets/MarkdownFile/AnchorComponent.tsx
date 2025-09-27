import { ReadmeFileProps } from './types';
import { baseDir, ensureSlash } from './utils';

type AnchorComponentProps = React.ComponentProps<'a'> & ReadmeFileProps;

export function AnchorComponent({ children, ...props }: AnchorComponentProps) {
  const {
    href = '',
    markdownUrl,
    linkedFileRootPath,
    readmeUrl,
    ...propsMinusHref
  } = props;
  const nonUrlLink =
    !href || href.startsWith('mailto:') || href.startsWith('#');
  if (nonUrlLink) return <a {...props}>{children}</a>;
  const targetProps = { target: '_blank', rel: 'noreferrer' };
  const newProps = { ...props, ...targetProps };
  if (href.startsWith('http')) return <a {...newProps}>{children}</a>;
  const newPropsMinusHref = { ...propsMinusHref, ...targetProps };
  const formattedHref = getFormattedHref({
    href,
    markdownUrl,
    linkedFileRootPath,
    readmeUrl,
  });
  return (
    <a href={formattedHref} {...newPropsMinusHref}>
      {children}
    </a>
  );
}

function getFormattedHref(
  props: ReadmeFileProps & { href: string; markdownUrl: string }
) {
  const { href, markdownUrl, linkedFileRootPath } = props;
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const origin = new URL(window.location.origin);
  const clean = href.replace(/^\.?\//, '');
  const root = ensureSlash(linkedFileRootPath);
  if (root) {
    const rootBase = root.startsWith('http')
      ? new URL(root)
      : new URL(root, origin);
    return new URL(clean, rootBase).toString();
  }
  if (href.startsWith('/')) return new URL(href, origin).toString();
  const dir = baseDir(markdownUrl);
  return new URL(href, dir).toString();
}
