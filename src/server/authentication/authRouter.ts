import { authenticatedProcedure, publicProcedure, router } from "../router";
import { registerUserMutation, registerUserSchema } from './registerUserMutation';
import { loginUserMutation, loginUserSchema } from './loginUserMutation';
import { refreshTokenMutation } from "./refreshTokenMutation";
import { clearAuthCookies } from "./jwtCookies";

export const authRouter = router({
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicProcedure
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: authenticatedProcedure 
    .mutation(async ({ ctx }) => {
      console.log('CLEARRRRING COOKIES');
      clearAuthCookies({ res: ctx.res });
      ctx.user = null;
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('AWAITTTTEDD');
      return { success: true }
    }),

  validateUser: authenticatedProcedure
    .query(({ ctx }) => {
      console.log('<><><><><><>< validate user: ', ctx.user);
      
      return ({
        isAuthenticated: !!ctx.user,
        user: ctx.user
      });
    }),

  refreshToken: publicProcedure
    .mutation(refreshTokenMutation),

  authCheck: publicProcedure.query(({ ctx }) => {
    console.log("AUHT CHECK", ctx.user);
    return { isAuthenticated: !!ctx.user };
  })
});
