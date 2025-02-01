import { SQL_DELETE_PASSWORD_RESET_RECORD, SQL_GET_PASSWORD_RESET_RECORD_BY_TOKEN } from "../../db/sql";
import { PasswordResetTokenSchema } from "../schemas";
import { verifyToken, VerifyTokenMutationProps, VerifyTokenReturnProps } from "../utils/verifyToken";

export async function verifyPasswordResetTokenMutation (
  props: VerifyTokenMutationProps
): Promise<VerifyTokenReturnProps> {
  const { input: { token } } = props;

  return verifyToken({
    token,
    getTokenSql: SQL_GET_PASSWORD_RESET_RECORD_BY_TOKEN,
    getTokenResponseSchema: PasswordResetTokenSchema,
    onSuccess: async ({ client }) => {
      await client.query(SQL_DELETE_PASSWORD_RESET_RECORD, [token]);
    }
  });
}
