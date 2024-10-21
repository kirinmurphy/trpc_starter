import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from '../db/pool';
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { SQL_GET_USER_BY_EMAIL } from "../db/sql";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_SECRET_EXPIRES_IN } from "./jwtCookies";
import { ContextType } from "./context";
import { ACCESS_COOKIE_NAME } from "./jwtCookieNames";

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
} as const;

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

    console.log('email: ', email, user.id, user.name);
    const token = jwt.sign(
      { userId: user.id }, 
      ACCESS_TOKEN_SECRET, 
      { expiresIn: ACCESS_TOKEN_SECRET_EXPIRES_IN }
    );
    
    ctx.res.setHeader(
      "Set-Cookie",
      `${ACCESS_COOKIE_NAME}=${token}; ${Object.entries(cookieDefaults)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")}`
    );
  
    return { success: true, message: "Logged in successfully" };

  } catch (err: unknown) {
    console.log('err', err);
  }
}
