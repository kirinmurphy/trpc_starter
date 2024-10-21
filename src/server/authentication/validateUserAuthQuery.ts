import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { pool } from "../db/pool";
import { SQL_SELECT_MEMBER } from '../db/sql';
import { decodeAccessTokenCookie, getAccessTokenCookie, getRefreshTokenCookie } from "./jwtCookies";
import { User } from './types';
// import { isLoggingOut } from './authState';

type ValidateUserResultType = {
  isAuthenticated: boolean; 
  user: User | null;
}

interface ValidateUrlProps {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
}


export async function validateUserAuthQuery (
  { req }: ValidateUrlProps
): Promise<ValidateUserResultType> {
  
  const accessToken = getAccessTokenCookie({ req });
  const refreshToken = getRefreshTokenCookie({ req });

  console.log('accessTokenCookie', accessToken?.substring(0, 20));

  const token = accessToken || refreshToken;

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = await getUser({ token });
    const userResponse = user ? { id: user.id, name: user.name, email: user.email } : null;
    return { isAuthenticated: !!user, user: userResponse };

  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.log('access Token expired');
      return { isAuthenticated: false, user: null }
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
