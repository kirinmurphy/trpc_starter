import bcrypt from "bcrypt";
import { z } from 'zod';
import { pool } from '../db/pool';
import { setAccessTokenCookie, setRefreshTokenCookie } from './jwtCookies';
import { ContextType } from './types';
import { SQL_CREATE_MEMBER } from "../db/sql";


export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});

type RegisterInput = z.infer<typeof registerUserSchema>;

interface RegisterUserMutationProps {
  input: RegisterInput;
  ctx: ContextType
}

export async function registerUserMutation ({ input, ctx }: RegisterUserMutationProps) {
  const { name, email, password } = input;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      SQL_CREATE_MEMBER,
      [name, email, hashedPassword]
    );
    const userId = result.rows[0].id;

    console.log('<<<<<<<<<<<<<<<<< <AUUUUGGGHHHH 3');
    setAccessTokenCookie({ res: ctx.res, userId });
    setRefreshTokenCookie({ res: ctx.res, userId  });

    return { success: true, userId };
  } catch (err) {
    console.log('auth error', err);
    return { success: false, error: 'Registration failed' };
  }
}
