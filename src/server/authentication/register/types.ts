import { z } from "zod";

export const VerificationTokenSchema = z.object({
  token: z.string()
    .length(43, 'Invalid token'),
  user_id: z.union([z.string(), z.number()]),
  email: z.string(),
  expires_at:  z.union([
    z.string().datetime(),
    z.date()
  ])  
});


export const VerificationTokenMinimalSchema = z.object({
  token: z.string(),
  email: z.string(),
});


// type VerificationType = z.infer<typeof VerificationTokenSchema>;

export const MemberEmailSchema =  z.object({
  email: z.string()
});
