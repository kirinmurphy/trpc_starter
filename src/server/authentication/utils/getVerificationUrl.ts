import { RouteUrlsEnum } from '../../../client/routing/routeUrls';

interface GetVerificationUrlProps {
  verificationToken: string;
  route: RouteUrlsEnum;
  addlParams?: string[];
}

export function getVerificationUrl({
  verificationToken,
  route,
  addlParams,
}: GetVerificationUrlProps): string {
  const domain = process.env.WEBSITE_DOMAIN || 'localhost';
  const protocol = process.env.API_PROTOCOL || 'http';

  const addlParamsString = addlParams?.length ? `&${addlParams.join('&')}` : '';
  return `${protocol}://${domain}${route}?token=${verificationToken}${addlParamsString}`;
}
