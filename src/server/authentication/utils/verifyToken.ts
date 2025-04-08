import { z } from 'zod';
import {
  ERR_VERIFICATION_TOKEN_EXPIRED,
  ERR_NO_VERIFICATION_TOKEN,
  ERR_VERIFICATION_FAILED,
} from '../../../utils/messageCodes';
import { getPool } from '../../db/pool';
import { parseDBQueryResult } from '../../db/parseDBQueryResult';
import { ContextType } from '../types';
import { SQL_SET_USER_AS_VERIFIED } from '../../db/sql';

export interface VerifyTokenMutationProps {
  ctx: ContextType;
  input: {
    token: string;
  };
}

interface VerifyTokenProps {
  token: string;
  getTokenSql: string;
  deleteTokenSql: string;
  getTokenResponseSchema: z.ZodSchema;
}

export interface VerifyTokenReturnProps {
  success: boolean;
  userId?: string | number;
  error?: string;
}

export async function verifyToken(
  props: VerifyTokenProps
): Promise<VerifyTokenReturnProps> {
  const { token, getTokenSql, deleteTokenSql, getTokenResponseSchema } = props;

  const client = await getPool().connect();

  if (!token) {
    // TODO: should I throw an error instead of returning false here?
    return { success: false, error: ERR_VERIFICATION_FAILED };
  }

  try {
    const tokenResult = await client.query(getTokenSql, [token]);
    const tokenDetails = parseDBQueryResult(
      tokenResult,
      getTokenResponseSchema
    ) as z.infer<typeof getTokenResponseSchema>;

    if (!tokenDetails) {
      return { success: false, error: ERR_NO_VERIFICATION_TOKEN };
    }

    const { user_id: userId, expires_at: expiresAt } = tokenDetails;

    if (new Date(expiresAt) < new Date()) {
      // TODO: create logger of all sql failure calls
      client.query(deleteTokenSql, [token]).catch((err) => {
        console.error('failed to delete expired token', err);
      });

      return { success: false, userId, error: ERR_VERIFICATION_TOKEN_EXPIRED };
    }

    await client.query('BEGIN');
    try {
      await client.query(SQL_SET_USER_AS_VERIFIED, [userId]);
      // TODO: This deletes the token before they complete the form,
      // so if they navigate away and return, they will have to request a new token
      // is this better?  or should we delete the token only after the form is submitted?
      await client.query(deleteTokenSql, [token]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }

    return { success: true, userId };
  } catch (err: unknown) {
    console.log('auth error', err);
    return { success: false, error: ERR_VERIFICATION_FAILED };
  } finally {
    client.release();
  }
}
