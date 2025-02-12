import {
  SQL_DELETE_VERIFICATION_RECORD,
  SQL_GET_VERIFICATION_RECORD_BY_TOKEN,
} from '../../db/sql';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../jwtActions';
import { VerificationTokenSchema } from '../schemas';
import {
  verifyToken,
  VerifyTokenMutationProps,
  VerifyTokenReturnProps,
} from '../utils/verifyToken';

export async function verifyAccountMutation(
  props: VerifyTokenMutationProps
): Promise<VerifyTokenReturnProps> {
  const {
    ctx: { res },
    input: { token },
  } = props;

  const verificationResult = await verifyToken({
    token,
    getTokenSql: SQL_GET_VERIFICATION_RECORD_BY_TOKEN,
    deleteTokenSql: SQL_DELETE_VERIFICATION_RECORD,
    getTokenResponseSchema: VerificationTokenSchema,
  });

  const { success, userId } = verificationResult;

  if (success && userId) {
    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });
  }

  return verificationResult;
}
