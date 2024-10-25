import bcrypt from "bcrypt";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { pool } from '../db/pool';
import { SQL_GET_USER_BY_EMAIL } from "../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "./jwtActions";
import { MutationPropsWithInput } from "./types";

export const loginUserSchema = z.object({
  email: z.string()
    .trim()
    .max(254, 'Invalid email')
    .email('Invalid email format'),
  password: z.string()
    .trim()
    .max(72, 'Invalid password')
});

type LoginInputType = z.infer<typeof loginUserSchema>;

export async function loginUserMutation ({ input, ctx }: MutationPropsWithInput<LoginInputType>) {
  const { res } = ctx;

  try {
    const { email, password } = input;  
    
    const result = await pool.query(SQL_GET_USER_BY_EMAIL, [email]);
    const user = result.rows[0];
    
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' });
    }

    setAccessTokenCookie({ res, userId: user.id });
    setRefreshTokenCookie({ res, userId: user.id });

    return { success: true, message: "Logged in successfully" };

  } catch (err: unknown) {
    console.log('err', err);
  }
}
