import { 
  ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED, 
  ERR_NO_ACCOUNT_VERIFICATION_TOKEN, 
  ERR_VERIFICATION_FAILED
} from "../../../utils/messageCodes";
import { getPool } from "../../db/pool";
import { 
  SQL_DELETE_VERIFICATION_TOKEN, 
  SQL_SET_MEMBER_AS_VERIFIED, 
  SQL_VERIFY_ACCOUNT 
} from "../../db/sql";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { ContextType } from "../types";
import { VerificationTokenSchema } from "../schemas";

interface VerifyAccountProps {
  ctx: ContextType;
  input: {
    token: string;
  }
}

interface VerifyAccountReturnProps {
  success: boolean;
  userId?: string | number;
  error?: string;
}

export async function verifyAccountMutation (
  props: VerifyAccountProps
): Promise<VerifyAccountReturnProps> {

  const { 
    ctx: { res }, 
    input: { token } 
  } = props;

  const client = await getPool().connect();

  try {
    const tokenResult = await client.query(SQL_VERIFY_ACCOUNT, [token]);
    const tokenDetails = parseDBQueryResult(tokenResult, VerificationTokenSchema);

    if ( !tokenDetails ) {
      return { success: false, error: ERR_NO_ACCOUNT_VERIFICATION_TOKEN }; 
    }

    const { user_id: userId, expires_at: expiresAt } = tokenDetails;

    if ( new Date(expiresAt) < new Date() ) {
      return { success: false, userId, error: ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED };
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
    return { success: false, error: ERR_VERIFICATION_FAILED };

  } finally {
    client.release();
  }
}
