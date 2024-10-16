import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { pool } from '../db/pool';
import { JWT_SECRET } from './constants';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { ContextType } from './types';
import { setAuthCookie } from './cookieActions';

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

type LoginInputType = z.infer<typeof loginUserSchema>;

interface LoginUserMutationProps {
  input: LoginInputType
  ctx: ContextType
}

export async function loginUserMutation ({ input, ctx }: LoginUserMutationProps) {
  const { email, password } = input;

  try {
    const result = await pool.query('SELECT * FROM members WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
    setAuthCookie(ctx.res, token);

    return { 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email }
    };
  } catch (err) { 
    console.error('Login error: ', err);
    if  (err instanceof TRPCError ) { throw err }
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Login failed' });
  }
}
