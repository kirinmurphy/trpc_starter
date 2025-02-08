import { useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED, ERR_VERIFICATION_FAILED } from "../../utils/messageCodes";
import { ROUTE_URLS } from "../routing/routeUrls";
import { MutationProcedure } from "./trpcTypes";

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

interface VerificationData {
  success: boolean; 
  error?: string;
  userId?: string | number;
}

interface TokenInput {
  token: string;
};

interface UseTokenParamVerificationProps<TProcedure> {
  verifyTokenProcedure: MutationProcedure<TProcedure, TokenInput, VerificationData>;
  onVerificationSuccess?: (data: VerificationData) => Promise<void> | void;
  verificationType: keyof typeof errorRedirectConfigs;
}

interface UseTokenVerificationResult {
  isLoading: boolean;
  tokenExpired: boolean;
  userId?: string;
}

export function useTokenParamVerification<TProcedure> (
  props: UseTokenParamVerificationProps<TProcedure>
): UseTokenVerificationResult {

  const { verificationType, verifyTokenProcedure, onVerificationSuccess } = props;

  const errorRedirectConfig = errorRedirectConfigs[verificationType];

  const router = useRouter();
  const token = router.state.location.search.token;
  const navigate = useNavigate();

  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  const { mutate, data, isLoading } = verifyTokenProcedure.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        if ( onVerificationSuccess ) { await onVerificationSuccess(data); }        
        return;
      }
      
      if ( data?.error ) {
        if ( data?.error === ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED ) {
          setTokenExpired(true);
        } else {
          navigate(errorRedirectConfig);
        }
      }
    },
    onError: (err) => {
      console.error('Verification error', err);
      navigate(errorRedirectConfig);
    }
  });


  useEffect(() => {    
    if ( !token ) { navigate(errorRedirectConfig); return; }
    mutate({ token });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const userId = data?.userId?.toString();

  return {
    tokenExpired,
    isLoading,
    userId
  }
}
