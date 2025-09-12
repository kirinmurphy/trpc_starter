import { RouteUrlsEnum } from '../../../client/routing/routeUrls';

interface GetVerificationUrlProps {
  verificationToken: string;
  route: RouteUrlsEnum;
}

export function getVerificationUrl({
  verificationToken,
  route,
}: GetVerificationUrlProps): string {
  const domain = process.env.WEBSITE_DOMAIN || 'localhost';

  return `https://${domain}${route}?token=${verificationToken}`;
}
