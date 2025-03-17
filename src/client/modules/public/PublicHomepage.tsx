import { MarkdownFile } from '../../widgets/MarkdownFile';
import { SuperAdminDevAutoLogin } from './authenticating/SuperAdminDevAutoLogin';

const GITHUB_README = {
  markdownUrl:
    'https://raw.githubusercontent.com/kirinmurphy/trpc_starter/refs/heads/main/README.md',
  externalLink: 'https://github.com/kirinmurphy/trpc_starter',
  linkedFileRootPath: 'https://github.com/kirinmurphy/trpc_starter/blob/main/',
};

export function PublicHomepage() {
  return (
    <>
      <SuperAdminDevAutoLogin />
      <MarkdownFile {...GITHUB_README} />
    </>
  );
}
