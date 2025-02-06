import { z } from "zod";
import { EmailSentStatus } from "../../utils/types";

export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string(),
  verified: z.boolean(),
  created_at: z.union([
    z.string().datetime(),
    z.date()
  ])
});

export const LoginUserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  password: z.string(),
  verified: z.boolean(),
});

const EmailSentStatusTypes = z.nativeEnum(EmailSentStatus);

export const EmailSentStatusSchema = z.object({
  email_sent_status: EmailSentStatusTypes
});

export const VerificationTokenSchema = z.object({
  token: z.string()
    .length(43, 'Invalid token'),
  user_id: z.union([z.string(), z.number()]),
  email: z.string(),
  email_sent_status: EmailSentStatusTypes,
  expires_at:  z.union([
    z.string().datetime(),
    z.date()
  ])  
});

export const VerificationTokenMinimalSchema = z.object({
  token: z.string(),
  email: z.string(),
});

export const MemberEmailSchema =  z.object({
  email: z.string()
});

export const GetUserIdByEmailSchema = z.object({
  // TODO: do we want z.uuid() here? 
  id: z.union([z.string(), z.number()]),
});


export const PasswordResetTokenSchema = z.object({
  token: z.string()
    .length(43, 'Invalid token'),
  user_id: z.union([z.string(), z.number()]),
  email: z.string(),
  expires_at:  z.union([
    z.string().datetime(),
    z.date()
  ])  
});
