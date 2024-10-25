import bcrypt from "bcrypt";
import { z } from 'zod';
import { pool } from '../db/pool';
import { SQL_CREATE_MEMBER } from "../db/sql";
import { ContextType } from "./types";
import { setAccessTokenCookie, setRefreshTokenCookie } from "./jwtActions";
import { createEmailSchema, createPasswordSchema } from "./sharedSchema";


export const registerUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(70, 'Name cannot exceed 70 characters')
    .trim(),
  email: createEmailSchema,
  password: createPasswordSchema
});

type RegisterInput = z.infer<typeof registerUserSchema>;

interface RegisterUserMutationProps {
  input: RegisterInput;
  ctx: ContextType
}

export async function registerUserMutation (props: RegisterUserMutationProps) {
  const { 
    input: { name, email, password }, 
    ctx: { res  } 
  } = props;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      SQL_CREATE_MEMBER,
      [name, email, hashedPassword]
    );
    const userId = result.rows[0].id;

    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });

    return { success: true, userId };
  } catch (err) {
    console.log('auth error', err);
    return { success: false, error: 'Registration failed' };
  }
}
