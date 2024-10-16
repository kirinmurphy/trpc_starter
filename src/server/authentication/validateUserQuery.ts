import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { pool } from "../db/pool";
import { COOKIE_NAME, JWT_SECRET } from "./constants";
import { User } from './types';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

type ValidateUserResultType = {
  isAuthenticated: boolean; 
  user: User | null;
}

type ValidateUserType = Pick<CreateNextContextOptions, 'req' | 'res'>;

export async function validateUserQuery({ req }: ValidateUserType): Promise<ValidateUserResultType> {
  console.log('validateUserQuery called');
  
  const authHeader = req.headers['authorization'];
  const cookieHeader = req.headers['cookie'];
  
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('Token found in Authorization header');
  } else if (cookieHeader) {
    const cookies = cookie.parse(cookieHeader);
    token = cookies[COOKIE_NAME];
    console.log('Token found in cookie');
  }

  if (!token) {
    console.log('No token found');
    return { isAuthenticated: false, user: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    console.log('Token decoded, userId:', decoded.userId);

    const result = await pool.query('SELECT id, name, email FROM members WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found in database');
      return { isAuthenticated: false, user: null };
    }

    console.log('User authenticated:', user.id);
    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

  } catch (err) {
    console.error('Token verification failed:', err);
    // Instead of throwing an error, return not authenticated
    return { isAuthenticated: false, user: null };
  }
}