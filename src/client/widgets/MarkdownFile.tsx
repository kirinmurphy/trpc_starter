import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaLink } from 'react-icons/fa';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import mermaid from 'mermaid';

export interface ReadmeFileProps {
  markdownUrl: string;
  externalLink?: string;
  linkedFileRootPath?: string;
}

type QueryKey = ['markdown', string];

function Mermaid({ chart }: { chart: string }) {
  const id = useRef(`mmd-${Math.random().toString(36).slice(2)}`);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    let active = true;
    mermaid.render(id.current, chart).then(({ svg }) => {
      if (active && ref.current) ref.current.innerHTML = svg;
    });
    return () => {
      active = false;
    };
  }, [chart]);
  return <div ref={ref} />;
}

const Code = ((props) => {
  const { inline, className, children, ...rest } = props as any;
  const lang = /language-(\w+)/.exec(className || '')?.[1];
  if (!inline && lang === 'mermaid')
    return <Mermaid chart={String(children).trim()} />;
  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}) as NonNullable<Components['code']>;

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'img'],
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img || []),
      ['src', /^(https?:|data:|\/|\.\/|\.\.\/)/],
      ['alt', true],
      'width',
      'height',
      'className',
    ],
    a: [
      ...(defaultSchema.attributes?.a || []),
      ['href', /^(https?:|mailto:|\/|#|\.\/|\.\.\/)/],
      'target',
      'rel',
    ],
  },
};

function ensureSlash(s?: string) {
  if (!s) return s;
  return s.endsWith('/') ? s : `${s}/`;
}

function baseDir(markdownUrl: string) {
  const origin = new URL(window.location.origin);
  const u = new URL(markdownUrl, origin);
  return new URL('.', u);
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
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

function ImgSmart(props: any) {
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

export function MarkdownFile(props: ReadmeFileProps) {
  const { markdownUrl, externalLink, linkedFileRootPath } = props;
  const styles = getMarkdownStyles();

  const {
    data: mdText,
    error,
    isLoading,
  } = useQuery<string, Error, string, QueryKey>({
    queryKey: ['markdown', markdownUrl],
    queryFn: fetchMarkdownContent,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className={styles.error}>
        Failed to load markdown content. Please try again later.
      </div>
    );
  }

  if (!mdText) return null;

  const components: Components = {
    code: Code,
    a: ({ children, ...props }) => {
      const { href = '', ...propsMinusHref } = props as any;
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
      });
      return (
        <a href={formattedHref} {...newPropsMinusHref}>
          {children}
        </a>
      );
    },
    img: (p) => {
      const propsAny = p as any;
      return (
        <ImgSmart
          {...propsAny}
          markdownUrl={markdownUrl}
          linkedFileRootPath={linkedFileRootPath}
        />
      );
    },
  };

  return (
    <article className={styles.wrapper}>
      {externalLink && (
        <a
          className="block mb-4 absolute top-7 right-8"
          href={externalLink}
          target="_blank"
          rel="noreferrer"
        >
          <FaLink className="size-6" />
        </a>
      )}
      <Markdown
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          rehypeSlug,
        ]}
        components={components}
      >
        {mdText}
      </Markdown>
    </article>
  );
}

function getFormattedHref(props: ReadmeFileProps & { href: string }) {
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

async function fetchMarkdownContent({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<string> {
  const url = queryKey[1];
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch markdown: ${response.statusText}`);
  return response.text();
}

function getMarkdownStyles() {
  return {
    wrapper: `
      max-w-[850px] mx-auto relative p-6 bg-[#111] prose prose-slate
      prose-headings:font-bold prose-h1:text-2xl prose-h1:mb-4 prose-h2:text-xl
      prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-7 prose-p:mb-4 prose-a:text-gray-200 hover:prose-a:text-white
      prose-strong:font-semibold prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:my-2
      prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded prose-code:text-sm prose-code:font-mono
      prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4
      prose-blockquote:italic prose-blockquote:text-gray-600 prose-img:rounded-lg prose-img:shadow-md
      dark:prose-invert dark:prose-pre:bg-[#222] dark:prose-code:text-gray-200
    `
      .replace(/\s+/g, ' ')
      .trim(),
    loading: `animate-pulse space-y-4`.replace(/\s+/g, ' ').trim(),
    loadingBar: `h-4 bg-gray-200 rounded`.replace(/\s+/g, ' ').trim(),
    error: `text-red-500 p-4 rounded bg-red-50 dark:bg-red-900/20`
      .replace(/\s+/g, ' ')
      .trim(),
  };
}
