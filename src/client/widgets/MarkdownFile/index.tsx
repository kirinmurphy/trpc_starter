import { useQuery } from '@tanstack/react-query';
import { FaLink } from 'react-icons/fa';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { BaseReadmeFileProps } from './types';
import { ImgSmart } from './ImgSmart';
import CodeComponent from './CodeComponent';
import { AnchorComponent } from './AnchorComponent';

type QueryKey = ['markdown', string];

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

export function MarkdownFile({ readmeUrl }: BaseReadmeFileProps) {
  const styles = getMarkdownStyles();
  const markdownUrl = getMarkdownUrl(readmeUrl);
  const linkedFileRootPath = getLinkedFileRootPath(readmeUrl);

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
    code: CodeComponent,
    a: (props) => (
      <AnchorComponent
        {...props}
        markdownUrl={markdownUrl}
        linkedFileRootPath={linkedFileRootPath}
        readmeUrl={readmeUrl}
      />
    ),
    img: (props) => (
      <ImgSmart
        {...props}
        markdownUrl={markdownUrl}
        linkedFileRootPath={linkedFileRootPath}
      />
    ),
  };

  return (
    <article className={styles.wrapper}>
      {readmeUrl && (
        <a
          className="block mb-4 absolute top-7 right-8"
          href={readmeUrl}
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
      max-w-[1100px] mx-auto relative p-6 bg-[#111] prose prose-slate
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

function getMarkdownUrl(readmeUrl: string): string {
  const { host, pathname } = new URL(readmeUrl);
  if (host !== 'github.com') return readmeUrl;
  const [, user, repo, , branch, ...rest] = pathname.split('/');
  return `https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${branch}/${rest.join('/')}`;
}

function getLinkedFileRootPath(readmeUrl: string) {
  try {
    const u = new URL(readmeUrl);
    const parts = u.pathname.split('/');
    parts.pop();
    return `${u.origin}${parts.join('/')}/`;
  } catch {
    return '';
  }
}
