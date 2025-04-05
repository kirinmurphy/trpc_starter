import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getPool } from '../../db/pool';
import { SQL_COMPLETE_USER_ADMIN_SETUP } from '../../db/sql';
import { writeSystemStatus } from '../../systemStatus/systemStatus';
import { SYSTEM_STATUS } from '../../systemStatus/types';
import { ContextType } from '../types';
import {
  resetPasswordBaseFields,
  checkIfConfirmPasswordMatches,
  userNameSchema,
} from '../authFormsSchemas';
import { TRPCError } from '@trpc/server';

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
    const result = await getPool().query(SQL_COMPLETE_USER_ADMIN_SETUP, [
      userId,
      username,
      hashedPassword,
    ]);
    console.log('result', result);
    const systemStatusUpdated = writeSystemStatus(SYSTEM_STATUS.READY);
    if (!systemStatusUpdated) {
      console.warn(
        'System status update failed, but user setup completed successfully'
      );
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('super admin setup failed', err);
    writeSystemStatus(SYSTEM_STATUS.IN_PROGRESS);

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'Unable to complete account setup, please wait and try again.  If you continue to face problems, please check the build logs and rebuild the application if necessary.',
      cause: err,
    });
  }
}
