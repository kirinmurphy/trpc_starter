import { useSearch } from '@tanstack/react-router';
import { RouteUrlsEnum } from '../../routing/routeUrls';

interface Props {
  from: RouteUrlsEnum;
}

export function useNotificationQueryParam<NotificationType>({
  from,
}: Props): NotificationType {
  const search = useSearch({ from });
  return search.notification as NotificationType;
}
