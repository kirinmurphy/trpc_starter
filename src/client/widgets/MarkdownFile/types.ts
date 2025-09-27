export interface BaseReadmeFileProps {
  readmeUrl: string;
}

export interface ReadmeFileProps extends BaseReadmeFileProps {
  markdownUrl: string;
  linkedFileRootPath?: string;
}
