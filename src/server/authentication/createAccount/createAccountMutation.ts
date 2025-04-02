import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getPool } from '../../db/pool';
import { isDuplicateDBValue } from '../../db/isPostgresError';
import { SQL_CREATE_USER } from '../../db/sql';
import { ContextType } from '../types';
import {
  createEmailSchema,
  createPasswordSchema,
  userNameSchema,
} from '../authFormsSchemas';
import { initVerifyAccountFlow } from './initVerifyAccountFlow';

const copy = {
  duplicateEmail: 'An account with this email already exists.',
  registrationFailed: 'Registration failed.',
};

export const createAccountSchema = z.object({
  userName: userNameSchema,
  email: createEmailSchema,
  password: createPasswordSchema,
});

type CreateAccountInput = z.infer<typeof createAccountSchema>;

interface CreateAccountMutationProps {
  input: CreateAccountInput;
  ctx: ContextType;
}

interface CreateAccountResponseProps {
  success: boolean;
  userId: string;
}

export async function createAccountMutation({
  input,
}: CreateAccountMutationProps): Promise<CreateAccountResponseProps> {
  const { userName, email, password } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await getPool().query(SQL_CREATE_USER, [
      userName,
      email,
      hashedPassword,
    ]);

    const userId = result.rows[0].id;

    await initVerifyAccountFlow({ userId, email });

    return { success: true, userId };
  } catch (err: unknown) {
    const isDupeError = isDuplicateDBValue({
      err,
      property: 'users_email_key',
    });
    const errMessage = isDupeError
      ? copy.duplicateEmail
      : copy.registrationFailed;
    throw errMessage;
  }
}
