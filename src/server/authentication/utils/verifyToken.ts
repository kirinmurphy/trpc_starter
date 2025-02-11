import { PoolClient } from "pg";
import { z } from "zod";
import { 
  ERR_VERIFICATION_TOKEN_EXPIRED, 
  ERR_NO_VERIFICATION_TOKEN, 
  ERR_VERIFICATION_FAILED
} from "../../../utils/messageCodes";
import { getPool } from "../../db/pool";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { ContextType } from "../types";

export interface VerifyTokenMutationProps {
  ctx: ContextType;
  input: {
    token: string;
  }
}

interface VerifyTokenProps {
  token: string;
  getTokenSql: string;
  getTokenResponseSchema: z.ZodSchema;
  onSuccess: (props: { 
    userId: string; 
    client: PoolClient
    token: string;  
  }) => Promise<void>;
}

export interface VerifyTokenReturnProps {
  success: boolean;
  userId?: string | number;
  error?: string;
}

export async function verifyToken (props: VerifyTokenProps): Promise<VerifyTokenReturnProps> {
  const { 
    token,
    getTokenSql,
    getTokenResponseSchema,
    onSuccess 
  } = props;

  const client = await getPool().connect();

  if ( !token ) {
    // TODO: should I throw an error instead of returning false here? 
    return { success: false, error: ERR_VERIFICATION_FAILED };
  }

  try {
    const tokenResult = await client.query(getTokenSql, [token]);
    const tokenDetails = parseDBQueryResult(tokenResult, getTokenResponseSchema) as z.infer<typeof getTokenResponseSchema>;

    if ( !tokenDetails ) {
      return { success: false, error: ERR_NO_VERIFICATION_TOKEN }; 
    }

    const { user_id: userId, expires_at: expiresAt } = tokenDetails;

    if ( new Date(expiresAt) < new Date() ) {
      return { success: false, userId, error: ERR_VERIFICATION_TOKEN_EXPIRED };
    }

    await onSuccess({ client, userId, token });

    return { success: !!tokenDetails, userId };

  } catch (err: unknown) {
    console.log('auth error', err);
    return { success: false, error: ERR_VERIFICATION_FAILED };

  } finally {
    client.release();
  }
}
