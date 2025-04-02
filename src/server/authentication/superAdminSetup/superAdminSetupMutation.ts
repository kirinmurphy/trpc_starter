import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getPool } from '../../db/pool';
import { SQL_SET_USER_PASSWORD } from '../../db/sql';
import { ContextType } from '../types';
import {
  resetPasswordBaseFields,
  checkIfConfirmPasswordMatches,
  userNameSchema,
} from '../authFormsSchemas';

export const SuperAdminSetupSchema = z
  .object({
    username: userNameSchema,
    ...resetPasswordBaseFields,
  })
  .superRefine(checkIfConfirmPasswordMatches);

type SuperAdminSetupInput = z.infer<typeof SuperAdminSetupSchema>;

interface SuperAdminSetupMutationProps {
  input: SuperAdminSetupInput;
  ctx: ContextType;
}

interface SuperAdminSetupResponseProps {
  success: boolean;
}

export async function superAdminSetupMutation({
  input,
}: SuperAdminSetupMutationProps): Promise<SuperAdminSetupResponseProps> {
  const { userId, username, password } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // TODO PR:  new SQL command for setup
    const result = await getPool().query(SQL_SET_USER_PASSWORD, [
      userId,
      username,
      hashedPassword,
    ]);
    console.log('result', result);
    return { success: true };
  } catch (err: unknown) {
    // TODO PR: re-trigger email send
    throw 'Unable to reset password: ' + err;
  }
}
