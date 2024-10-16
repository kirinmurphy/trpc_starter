import { publicProcedure, router } from "../router";
import { registerUserMutation, registerUserSchema } from './registerUserMutation';
import { loginUserMutation, loginUserSchema } from './loginUserMutation';
import { clearAuthCookie } from './cookieActions';

export const authRouter = router({
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicProcedure
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: publicProcedure 
    .mutation(({ ctx }) => {
      clearAuthCookie(ctx.res);
      return { success: true }
    }),

  validateUser: publicProcedure
    .query(({ ctx }) => ({
      isAuthenticated: !!ctx.user,
      user: ctx.user
    }))
});
