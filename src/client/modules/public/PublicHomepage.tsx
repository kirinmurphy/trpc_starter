import { Fragment } from 'react/jsx-runtime';
import { MarkdownFile } from '../../widgets/MarkdownFile';

const GITHUB_README = {
  markdownUrl:
    'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/README.md',
  externalLink: 'https://github.com/kirinmurphy/trpc_starter',
  linkedFileRootPath: 'https://github.com/kirinmurphy/trpc_starter/blob/main/',
};

const USER_MANAGEMENT_URLS = [
  'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/docs/auth.md',
  'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/docs/password_reset.md',
  'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/docs/super_admin_setup.md',
];

const DEVOPS_URLS = [
  'https://raw.githubusercontent.com/kirinmurphy/traefik_vps/refs/heads/main/README.md',
  'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/docs/cypress_options.md',
  'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/docs/email.md',
];

export function PublicHomepage() {
  return (
    <>
      <div className="mb-8">
        <MarkdownFile {...GITHUB_README} />
      </div>

      <Header>Infra / Devops</Header>

      {DEVOPS_URLS.map((url) => (
        <div className="mb-8" key={url}>
          <MarkdownFile
            markdownUrl={url}
            externalLink="https://github.com/kirinmurphy/trpc_starter"
            linkedFileRootPath="https://github.com/kirinmurphy/trpc_starter/blob/main/"
          />
        </div>
      ))}

      <Header>User and Account Management</Header>

      {USER_MANAGEMENT_URLS.map((url) => (
        <div className="mb-8" key={url}>
          <MarkdownFile
            markdownUrl={url}
            externalLink="https://github.com/kirinmurphy/trpc_starter"
            linkedFileRootPath="https://github.com/kirinmurphy/trpc_starter/blob/main/"
          />
        </div>
      ))}
    </>
  );
}

function Header({ children }: { children: string }) {
  return (
    <h2 className="max-w-[850px] mx-auto mb-4 text-3xl font-bold">
      {children}
    </h2>
  );
}
