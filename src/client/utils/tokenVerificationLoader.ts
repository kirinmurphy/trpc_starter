import { redirect } from "@tanstack/react-router";
import { ERR_VERIFICATION_FAILED, ERR_VERIFICATION_TOKEN_EXPIRED } from "../../utils/messageCodes";
import { ROUTE_URLS, RouteUrlsEnum } from "../routing/routeUrls";
import { MutateProcedure } from "./trpcTypes";

const errorRedirectConfigs = {
  account: {
    to: ROUTE_URLS.login,   
    search: { notification: ERR_VERIFICATION_FAILED }
  },
  password: {
    to: ROUTE_URLS.requestResetPasswordEmail,   
    search: { notification: ERR_VERIFICATION_FAILED }    
  }
}

interface TokenInput {
  token: string;
}

export interface TokenVerificationResult {
  success: boolean; 
  error?: string;
  userId?: string | number;
}

interface VerificationLoaderProps<TProcedure> {
  verificationType: keyof typeof errorRedirectConfigs;
  verifyTokenProcedure: MutateProcedure<TProcedure, TokenInput, TokenVerificationResult>;
  token: string | null;
  pathToRedirectOnSuccess?: RouteUrlsEnum;
  onVerificationSuccess?: () => void;
}

export async function tokenVerificationLoader<TProcedure>(props: VerificationLoaderProps<TProcedure>) {
  const {
    token,
    verificationType,
    verifyTokenProcedure,
    pathToRedirectOnSuccess,
    onVerificationSuccess,    
  } = props;

  const errorRedirectConfig = errorRedirectConfigs[verificationType];

  if (!token) {
    throw redirect(errorRedirectConfig);
  }

  try {
    const result = await verifyTokenProcedure.mutate({ token });
    const { error, success } = result;

    if (error === ERR_VERIFICATION_TOKEN_EXPIRED) {
      return { ...result, tokenExpired: true } 
    }

    if ( !success ) {
      throw redirect(errorRedirectConfig)      
    } else {
      if ( onVerificationSuccess ) { await onVerificationSuccess(); }

      if ( pathToRedirectOnSuccess ) {
        throw redirect({ to: pathToRedirectOnSuccess })
      }
    }

    return { ...result, tokenExpired: false };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw redirect(errorRedirectConfig);
  }
}
