import { queryClient } from '../trpcService/trpcClientService';

export async function clearAuthQueries() {
  await queryClient.invalidateQueries({ queryKey: ['auth'] });
  queryClient.removeQueries({ queryKey: ['auth'] });
}
