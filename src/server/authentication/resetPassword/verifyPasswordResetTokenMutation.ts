import { SQL_DELETE_PASSWORD_RESET_RECORD, SQL_GET_PASSWORD_RESET_RECORD_BY_TOKEN } from "../../db/sql";
import { verifyToken, VerifyTokenMutationProps, VerifyTokenReturnProps } from "../utils/verifyToken";
import { PasswordResetTokenSchema } from "../schemas";

export async function verifyPasswordResetTokenMutation (
  props: VerifyTokenMutationProps
): Promise<VerifyTokenReturnProps> {
  const { input: { token } } = props;

  return verifyToken({
    token,
    getTokenSql: SQL_GET_PASSWORD_RESET_RECORD_BY_TOKEN,
    getTokenResponseSchema: PasswordResetTokenSchema,
    onSuccess: async ({ client }) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await client.query(SQL_DELETE_PASSWORD_RESET_RECORD, [token]);
    }
  });
}
