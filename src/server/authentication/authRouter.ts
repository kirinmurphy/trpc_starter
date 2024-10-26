
import { router, procedures } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./loginUserMutation";
import { logoutUserMutation } from "./logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { registerUserMutation, registerUserSchema } from "./registerUserMutation";

const { publicQuery,  protectedQuery,  publicMutation } = procedures;

export const authRouter = router({
  signUp: publicMutation
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicMutation
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: publicMutation  
    .mutation(logoutUserMutation),

  isAuthenticated: publicQuery   
    .query(({ ctx: { userId } }) => ({
      isAuthenticated: !!userId,
      userId
    })),  
    
  refreshToken: publicMutation
    .mutation(refreshTokenMutation),    

  getUser: protectedQuery  
    .query(getUserQuery),
});  
