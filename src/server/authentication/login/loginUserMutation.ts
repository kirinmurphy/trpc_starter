import bcrypt from "bcrypt";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { getPool } from '../../db/pool';
import { SQL_GET_MEMBER_BY_EMAIL } from "../../db/sql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../jwtActions";
import { MutationPropsWithInput } from "../types";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { LoginUserSchema } from "../schemas";
import { ERR_ACCOUNT_NOT_VERIFIED, LOGIN_SUCCESS } from "../../../utils/messageCodes";

const errorLoginFailed: Omit<TRPCError, 'name'> = { code: 'NOT_FOUND', message: 'User not found' };

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
  const { email, password } = input;  

  try {    
    const result = await getPool().query(SQL_GET_MEMBER_BY_EMAIL, [email]);
    const user = parseDBQueryResult(result, LoginUserSchema);
    
    if ( !user ) { throw new TRPCError(errorLoginFailed); }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) { throw new TRPCError(errorLoginFailed); }

    const userId = user.id.toString();
    
    if ( !user.verified ) {
      return { 
        success: false, 
        userId,
        message: ERR_ACCOUNT_NOT_VERIFIED 
      };      
    }
    
    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });

    return { 
      success: true, 
      userId, 
      message: LOGIN_SUCCESS 
    };

  } catch (err: unknown) {
    console.log('err', err);

    if ( err instanceof TRPCError ) { throw err; }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occured.',
      cause: err
    });
  }
}
