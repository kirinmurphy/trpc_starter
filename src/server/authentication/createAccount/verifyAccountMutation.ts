import { 
  SQL_DELETE_VERIFICATION_RECORD, 
  SQL_SET_USER_AS_VERIFIED, 
  SQL_GET_VERIFICATION_RECORD_BY_TOKEN 
} from "../../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { VerificationTokenSchema } from "../schemas";
import { verifyToken, VerifyTokenMutationProps, VerifyTokenReturnProps } from "../utils/verifyToken";


export async function verifyAccountMutation (
  props: VerifyTokenMutationProps
): Promise<VerifyTokenReturnProps> {

  const {
    ctx: { res },
    input: { token }
  } = props;

  return verifyToken({
    token,
    getTokenSql: SQL_GET_VERIFICATION_RECORD_BY_TOKEN,
    getTokenResponseSchema: VerificationTokenSchema,
    onSuccess: async ({ client, userId }) => {
      await client.query('BEGIN');
      try {
        await client.query(SQL_SET_USER_AS_VERIFIED, [userId]);
        await client.query(SQL_DELETE_VERIFICATION_RECORD, [token]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
      
      setAccessTokenCookie({ res, userId });
      setRefreshTokenCookie({ res, userId });  
    }
  });
}

