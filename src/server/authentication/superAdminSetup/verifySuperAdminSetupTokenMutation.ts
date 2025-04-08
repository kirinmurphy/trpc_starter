import {
  SQL_DELETE_PASSWORD_RESET_REQUEST,
  SQL_GET_PASSWORD_RESET_REQUEST_BY_TOKEN,
} from '../../db/sql';
import {
  verifyToken,
  VerifyTokenMutationProps,
  VerifyTokenReturnProps,
} from '../utils/verifyToken';
import { PasswordResetTokenSchema } from '../schemas';

export async function verifySuperAdminSetupTokenMutation(
  props: VerifyTokenMutationProps
): Promise<VerifyTokenReturnProps> {
  const {
    input: { token },
  } = props;

  return verifyToken({
    token,
    getTokenSql: SQL_GET_PASSWORD_RESET_REQUEST_BY_TOKEN,
    deleteTokenSql: SQL_DELETE_PASSWORD_RESET_REQUEST,
    getTokenResponseSchema: PasswordResetTokenSchema,
  });
}
