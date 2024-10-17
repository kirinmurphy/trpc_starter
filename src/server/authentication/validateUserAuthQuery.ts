import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { pool } from "../db/pool";
import { COOKIE_NAME, JWT_SECRET } from "./constants";
import { User } from './types';
import { TRPCError } from '@trpc/server';

type ValidateUserResultType = {
  isAuthenticated: boolean; 
  user: User | null;
}

type ValidateUserType = Pick<CreateNextContextOptions, 'req' | 'res'>;

const SQL_SELECT_MEMBER = 'SELECT id, name, email FROM members WHERE id = $1';

export async function validateUserAuthQuery({ req }: ValidateUserType): Promise<ValidateUserResultType> {
  const cookieHeader = req.headers['cookie'];
  
  let token: string | undefined;

 if (cookieHeader) {
    const cookies = cookie.parse(cookieHeader);
    token = cookies[COOKIE_NAME];
    console.log('Token found in cookie');
  }

  if (!token) {
    console.log('No token found');
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = await getUser({ token });

    if (!user) {
      console.log('User not found in database');
      return { isAuthenticated: false, user: null };
    }

    console.log('User authenticated:', user.id);
    return {
      isAuthenticated: true,
      user: { id: user.id, name: user.name, email: user.email }
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token Expired' });
    }
    console.error('Token verification failed:', err);
    return { isAuthenticated: false, user: null };
  }
}

async function getUser ({ token } : { token: string }) {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
  const result = await pool.query(SQL_SELECT_MEMBER, [decoded.userId]);
  return result.rows[0];
}
