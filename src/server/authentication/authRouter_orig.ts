import { authenticatedProcedure, publicProcedure, router } from "../router";
import { registerUserMutation, registerUserSchema } from './registerUserMutation';
import { loginUserMutation, loginUserSchema } from './loginUserMutation';
// import { refreshTokenMutation } from "./refreshTokenMutation";
// import { clearAuthCookies } from "./jwtCookies";
// import { isLoggingOut, setLoggingOut } from "./authState";

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
      // ctx.user = null;
      ctx.res.setHeader('Set-Cookie', [])
      // clearAuthCookies({ req: ctx.req, res: ctx.res });
      console.log('AWAITTTTEDD');
      return { success: true }
    }),

  // validateUser: authenticatedProcedure
  //   .query(({ ctx }) => {
  //     console.log('<><><><><><>< validate user: ', ctx.user);
  //     return ({
  //       isAuthenticated: !!ctx.user,
  //       user: ctx.user
  //     });
  //   }),

  // refreshToken: publicProcedure
  //   .mutation(refreshTokenMutation),

  // authCheck: publicProcedure.query(({ ctx }) => {
  //   console.log("AUTH CHECK", ctx.user);
  //   return { isAuthenticated: !!ctx.user };
  // })
});
