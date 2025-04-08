import { useNavigate } from '@tanstack/react-router';
import { ROUTE_URLS } from '../../../routing/routeUrls';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';
import { trpcService } from '../../../trpcService/trpcClientService';
import { Button } from '../../../widgets/Button';

export function SuperAdminDevAutoLogin() {
  const navigate = useNavigate();

  if (!import.meta.env.DEV) {
    return <></>;
  }

  const { mutate } = trpcService.auth.autoLoginDevSuperAdmin.useMutation({
    onSuccess: async (data) => {
      if (data?.success) {
        await invalidateAuthCheckQuery();
        navigate({ to: ROUTE_URLS.authenticatedHomepage });
      }
    },
  });

  const handleAutoLogin = () => {
    mutate();
  };

  return (
    <div className="mb-4 text-right">
      <Button onClick={handleAutoLogin}>
        <span className="text-sm">SuperAdmin Login</span>
      </Button>
    </div>
  );
}
