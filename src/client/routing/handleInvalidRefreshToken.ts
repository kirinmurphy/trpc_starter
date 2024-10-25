import { queryClient } from '../trpcService/trpcClients';

export async function clearAuthQueries() {
  await queryClient.invalidateQueries({ queryKey: ['auth'] });
  queryClient.removeQueries({ queryKey: ['auth'] });
}
