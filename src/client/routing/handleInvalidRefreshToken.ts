import { queryClient } from '../../utils/trpcClients';
// import { ROUTE_URLS } from './routeUrls';

export async function handleInvalidRefreshToken() {
  await queryClient.invalidateQueries();
  queryClient.removeQueries();
}
