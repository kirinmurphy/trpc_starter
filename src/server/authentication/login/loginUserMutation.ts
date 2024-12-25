import bcrypt from "bcrypt";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { pool } from '../../db/pool';
import { SQL_GET_MEMBER_BY_EMAIL } from "../../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { MutationPropsWithInput } from "../types";

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
    
    const result = await pool.query(SQL_GET_MEMBER_BY_EMAIL, [email]);
    const member = result.rows[0];
    
    if (!member) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, member.password);
    if (!validPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' });
    }

    if ( !member.verified ) {
      return { success: false, message: 'account_not_verified' };      
    }
    
    setAccessTokenCookie({ res, userId: member.id });
    setRefreshTokenCookie({ res, userId: member.id });

    return { success: true, message: "Logged in successfully" };

  } catch (err: unknown) {
    console.log('err', err);
  }
}