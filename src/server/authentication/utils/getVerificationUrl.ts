import { RouteUrlsEnum } from "../../../client/routing/routeUrls";

interface GetVerificationUrlProps { 
  verificationToken: string, 
  route: RouteUrlsEnum;
}

export function getVerificationUrl ({ verificationToken, route }: GetVerificationUrlProps): string {
  const domain = process.env.WEBSITE_DOMAIN || 'localhost';
  const protocol = process.env.API_PROTOCOL || 'http';
  return `${protocol}://${domain}${route}?token=${verificationToken}`;
}
