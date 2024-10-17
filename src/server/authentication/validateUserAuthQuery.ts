import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { pool } from "../db/pool";
import { decodeAccessTokenCookie, getAccessTokenCookie } from "./jwtCookies";
import { User } from './types';
import { TRPCError } from '@trpc/server';

type ValidateUserResultType = {
  isAuthenticated: boolean; 
  user: User | null;
}

type ValidateUserType = Pick<CreateNextContextOptions, 'req' | 'res'>;

const SQL_SELECT_MEMBER = 'SELECT id, name, email FROM members WHERE id = $1';

export async function validateUserAuthQuery({ req }: ValidateUserType): Promise<ValidateUserResultType> {
  const accessToken = getAccessTokenCookie({ req });

  console.log('accessTokenCookie', accessToken);

  if (!accessToken) {
    console.log('No token found');
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = await getUser({ token: accessToken });

    if (!user) {
      console.log('User not found in database');
      return { isAuthenticated: false, user: null };
    }

    // console.log('User authenticated:', user.id);
    return {
      isAuthenticated: true,
      user: { id: user.id, name: user.name, email: user.email }
    };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.log('Token expired');
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token Expired' });
    }

    if (err instanceof JsonWebTokenError) {
      console.log('token not present, not authenticated', err);
      return { isAuthenticated: false, user: null };
    }

    console.error('Token verification failed:', err);
    return { isAuthenticated: false, user: null };
  }
}

async function getUser ({ token } : { token: string }) {
  const decoded = decodeAccessTokenCookie({ accessToken: token });
  const result = await pool.query(SQL_SELECT_MEMBER, [decoded.userId]);
  return result.rows[0];
}
