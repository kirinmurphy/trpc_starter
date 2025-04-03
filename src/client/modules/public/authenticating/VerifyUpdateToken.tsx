import {
  NavigateOptions,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { ROUTE_URLS } from '../../../routing/routeUrls';

interface VerifyUpdateTokenProps {
  from: (typeof ROUTE_URLS)[keyof typeof ROUTE_URLS];
  updateForm: React.ComponentType<{ userId: string }>;
  tokenFailRedirect: NavigateOptions;
}

export function VerifyUpdateToken(props: VerifyUpdateTokenProps) {
  const { from, updateForm: UpdateForm, tokenFailRedirect } = props;

  const navigate = useNavigate();
  const { routeData } = useLoaderData({ from });
  const { userId, tokenExpired } = routeData;

  useEffect(() => {
    if (tokenExpired) {
      navigate(tokenFailRedirect);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);

  if (!userId) {
    return <>Verifying...</>;
  }

  if (userId && !tokenExpired) {
    return <UpdateForm userId={userId} />;
  }

  // TODO: what do we do here, should this ever return?
  return <></>;
}
