import { redirect } from '@tanstack/react-router';
import {
  ERR_VERIFICATION_FAILED,
  ERR_VERIFICATION_TOKEN_EXPIRED,
} from '../../utils/messageCodes';
import { RouteUrlsEnum } from '../routing/routeUrls';
import { MutateProcedure } from './trpcTypes';

interface TokenInput {
  token: string;
}

export interface TokenVerificationResult {
  success: boolean;
  error?: string;
  userId?: string | number;
}

interface VerificationLoaderProps<TProcedure> {
  token: string | null;
  verifyTokenProcedure: MutateProcedure<
    TProcedure,
    TokenInput,
    TokenVerificationResult
  >;
  redirectToOnError: RouteUrlsEnum;
  onVerificationSuccess?: () => void;
}

export async function tokenVerificationLoader<TProcedure>(
  props: VerificationLoaderProps<TProcedure>
) {
  const { token, verifyTokenProcedure, redirectToOnError } = props;

  const errorRedirectConfig = {
    to: redirectToOnError,
    search: { notification: ERR_VERIFICATION_FAILED },
  };

  if (!token) {
    throw redirect(errorRedirectConfig);
  }

  try {
    const result = await verifyTokenProcedure.mutate({ token });
    const { error, success } = result;

    if (error === ERR_VERIFICATION_TOKEN_EXPIRED) {
      return { ...result, tokenExpired: true };
    }

    if (!success) {
      throw redirect(errorRedirectConfig);
    }

    return { ...result, tokenExpired: false };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw redirect(errorRedirectConfig);
  }
}
