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
      <MarkdownFile {...GITHUB_README} />

      <h2>User and Account Management</h2>
      {USER_MANAGEMENT_URLS.map((url) => (
        <Fragment key={url}>
          <MarkdownFile
            markdownUrl={url}
            externalLink="https://github.com/kirinmurphy/trpc_starter"
            linkedFileRootPath="https://github.com/kirinmurphy/trpc_starter/blob/main/"
          />
        </Fragment>
      ))}

      <h2>Infra / Devops</h2>
      {DEVOPS_URLS.map((url) => (
        <Fragment key={url}>
          <MarkdownFile
            markdownUrl={url}
            externalLink="https://github.com/kirinmurphy/trpc_starter"
            linkedFileRootPath="https://github.com/kirinmurphy/trpc_starter/blob/main/"
          />
        </Fragment>
      ))}
    </>
  );
}
