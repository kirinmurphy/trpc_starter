import { z } from "zod";
import { pool } from "../../db/pool";
import { 
  SQL_DELETE_VERIFICATION_TOKEN, 
  SQL_SET_MEMBER_AS_VERIFIED, 
  SQL_VERIFY_ACCOUNT 
} from "../../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { ContextType } from "../types";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { VerificationTokenSchema } from "./types";

const VerifyAccountPropsSchema = z.object({
  ctx: z.custom<ContextType>(),
  token: z.string()
});

type VerifyAccountProps = z.infer<typeof VerifyAccountPropsSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VerifyAccountReturnSchema = z.object({
  success: z.boolean(),
  userId: z.union([z.string(), z.number()]).optional(),
  error: z.string().optional(),
});

type VerifyAccountQueryReturnProps = z.infer<typeof VerifyAccountReturnSchema>;


export async function verifyAccountQuery (
  props: VerifyAccountProps
): Promise<VerifyAccountQueryReturnProps> {

  const validatedProps = VerifyAccountPropsSchema.parse(props);
  const { ctx: { res }, token } = validatedProps;

  const client = await pool.connect();

  try {
    const tokenResult = await client.query(SQL_VERIFY_ACCOUNT, [token]);
    const tokenDetails = parseDBQueryResult(tokenResult, VerificationTokenSchema);

    if ( !tokenDetails ) {
      return { success: false, error: 'no_account_verification_token' }; 
    }

    const { user_id: userId, expires_at: expiresAt } = tokenDetails;

    if (  expiresAt !== undefined ) {
    // if ( new Date(expiresAt) < new Date() ) {
      return { success: false, userId, error: 'account_verification_token_expired' };
    }

    await client.query('BEGIN');
    try {
      await client.query(SQL_SET_MEMBER_AS_VERIFIED, [userId]);
      await client.query(SQL_DELETE_VERIFICATION_TOKEN, [token]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
    
    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });

    return { success: !!tokenDetails };

  } catch (err: unknown) {
    console.log('auth error', err);
    return { success: false, error: 'Verification failed' };

  } finally {
    client.release();
  }
}
