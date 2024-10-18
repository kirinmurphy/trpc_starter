import bcrypt from "bcrypt";
import { pool } from '../db/pool';
import { setAccessTokenCookie, setRefreshTokenCookie } from './jwtCookies';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { ContextType } from './types';
import { SQL_GET_USER_BY_EMAIL } from "../db/sql";


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
    const result = await pool.query(SQL_GET_USER_BY_EMAIL, [email]);
    const user = result.rows[0];

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' });
    }

    setAccessTokenCookie({ res: ctx.res, userId: user.id });
    setRefreshTokenCookie({ res: ctx.res, userId: user.id });

    return { 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email }
    };
  } catch (err) { 
    console.log('Invalid login credentials: ', err);
    if  (err instanceof TRPCError ) { throw err }
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Login failed' });
  }
}
