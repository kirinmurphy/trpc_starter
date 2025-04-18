import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getPool } from '../../db/pool';
import { SQL_SET_USER_PASSWORD } from '../../db/sql';
import {
  resetPasswordBaseFields,
  checkIfConfirmPasswordMatches,
} from '../authFormsSchemas';
import { ContextType } from '../types';

export const ResetPasswordSchema = z
  .object(resetPasswordBaseFields)
  .superRefine(checkIfConfirmPasswordMatches);

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordMutationProps {
  input: ResetPasswordInput;
  ctx: ContextType;
}

interface ResetPasswordResponseProps {
  success: boolean;
}

export async function resetPasswordMutation({
  input,
}: ResetPasswordMutationProps): Promise<ResetPasswordResponseProps> {
  const { userId, password } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await getPool().query(SQL_SET_USER_PASSWORD, [
      userId,
      hashedPassword,
    ]);
    console.log('result', result);
    return { success: true };
  } catch (err: unknown) {
    throw 'Unable to reset password: ' + err;
  }
}
