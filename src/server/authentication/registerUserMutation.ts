import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { z } from 'zod';
import { setAuthCookie } from "./cookieActions";
import { pool } from '../db/pool';
import { JWT_SECRET } from './constants';
import { ContextType } from './types';

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
      'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

    setAuthCookie(ctx.res, token);

    return { success: true, userId };
  } catch (err) {
    console.log('auth error', err);
    return { success: false, error: 'Registration failed' };
  }
}
