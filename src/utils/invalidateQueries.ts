import { queryClient } from "./trpcClients";

export async function clearAuthQueries() {
  await queryClient.invalidateQueries({ queryKey: ['auth'] });
  queryClient.removeQueries({ queryKey: ['auth'] });
}

export async function invalidateAuthCheckQuery () {
  await queryClient.invalidateQueries({ queryKey: ['auth', 'validateUser'] });
}
