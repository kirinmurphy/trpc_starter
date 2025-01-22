import bcrypt from "bcrypt";
import { z } from 'zod';
import { escapeHTML } from "../../utils/escapeHtml";
import { getPool } from '../../db/pool';
import { isDuplicateDBValue } from "../../db/isPostgresError";
import { SQL_CREATE_MEMBER } from "../../db/sql";
import { ContextType } from "../types";
import { createEmailSchema, createPasswordSchema, inputIsUnsafe } from "../sharedSchema";
import { initVerifyAccountFlow } from "./initVerifyAccountFlow";
import { EmailResult } from "../../email/types";

const copy = {
  duplicateEmail: 'An account with this email already exists.',
  registrationFailed: 'Registration failed.',
}

export const createAccountSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(70, 'Name cannot exceed 70 characters')
    .trim()
    .transform(html => escapeHTML(html))
    .refine(inputIsUnsafe, 'Name contains potentially unsafe content'),
  email: createEmailSchema,
  password: createPasswordSchema
});

type CreateAccountInput = z.infer<typeof createAccountSchema>;

interface CreateAccountMutationProps {
  input: CreateAccountInput;
  ctx: ContextType
}

interface CreateAccountResponseProps {
  success: boolean;
  userId: string;
  verificationEmailSendStatus: EmailResult;
}

export async function createAccountMutation (
  { input }: CreateAccountMutationProps
): Promise<CreateAccountResponseProps> {

  const { name, email, password } = input; 

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await getPool().query(
      SQL_CREATE_MEMBER,
      [name, email, hashedPassword]
    );
    
    const userId = result.rows[0].id;

    const verificationEmailSendStatus = await initVerifyAccountFlow({ userId, email });
    return { success: true, userId, verificationEmailSendStatus };

  } catch (err: unknown) {
    const isDupeError = isDuplicateDBValue({ err, property: 'users_email_key' });
    const errMessage = isDupeError ? copy.duplicateEmail : copy.registrationFailed;
    throw errMessage;
  }
}
