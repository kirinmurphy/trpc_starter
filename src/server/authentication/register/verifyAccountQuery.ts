import { pool } from "../../db/pool";
import { 
  SQL_DELETE_VERIFICATION_TOKEN, 
  SQL_SET_MEMBER_AS_VERIFIED, 
  SQL_VERIFY_ACCOUNT 
} from "../../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { ContextType } from "../types";

interface VerifyAccountProps {
  ctx: ContextType;
  token: string;
}

interface VerifyAccountQueryReturnProps { 
  success: boolean;
  error?: string;
}

export async function verifyAccountQuery (
  props: VerifyAccountProps
): Promise<VerifyAccountQueryReturnProps> {

  const { ctx: { res }, token } = props;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // TODO: need more typesaftey here
    const tokenResult = await client.query(SQL_VERIFY_ACCOUNT, [token]);
    const tokenDetails = tokenResult.rows[0];

    if ( !tokenDetails ) {
      await client.query('ROLLBACK');
      return { success: false, error: 'Invalid verification token' };
    }

    const { user_id: userId } = tokenDetails;

    await client.query(SQL_SET_MEMBER_AS_VERIFIED, [userId]);

    await client.query(SQL_DELETE_VERIFICATION_TOKEN, [token]);

    await client.query('COMMIT');
    
    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });

    return { success: !!tokenDetails };
  } catch (err: unknown) {
    console.log('auth error', err);
    return { success: false, error: 'Verification failed' };
  }
}
