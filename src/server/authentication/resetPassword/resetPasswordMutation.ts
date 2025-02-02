import bcrypt from "bcrypt";
import { z } from "zod";
import { createPasswordSchema } from "../sharedSchema";
import { ContextType } from "../types";
import { getPool } from "../../db/pool";

export const ResetPasswordSchema = z.object({
  password: createPasswordSchema,
  confirmPassword: z.string().min(1, "Password confirmation is required")
}).superRefine((data, ctx) => {
  if ( data.password !== data.confirmPassword ) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords must match",
      path: ["confirmPassword"]
    });
  }
});

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordMutationProps {
  input: ResetPasswordInput;
  ctx: ContextType
}

interface ResetPasswordResponseProps {
  success: boolean;
}

export async function resetPasswordMutation (
  { input }: ResetPasswordMutationProps
): Promise<ResetPasswordResponseProps> {
  const { password } = input;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await getPool().query(
      SQL_RESET_PASSWORD
    )    
    return { success: true }
  } catch (err: unknown) {
    throw 'Unable to reset password';
  }

}