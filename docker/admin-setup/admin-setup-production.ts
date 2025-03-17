import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getPool } from '../../src/server/db/pool';
import { checkSuperAdminExists } from './utils/checkSuperAdminExists';
import { Pool, QueryResult } from 'pg';
import {
  SQL_CREATE_PASSWORD_RESET_REQUEST,
  SQL_CREATE_SUPER_ADMIN_USER,
} from '../../src/server/db/sql';
import { getUniqueToken } from '../../src/server/authentication/utils/getUniqueToken';
import { validateSuperAdminEmail } from './utils/validateSuperAdminEmail';
import { sendSuperAdminSetupEmail } from './setSuperAdminSetupEmail';

interface CreateProductionSuperAdminProps {
  pool: Pool;
  email: string;
}

async function createProductionSuperAdmin(
  props: CreateProductionSuperAdminProps
): Promise<{ token: string }> {
  const { pool, email } = props;
  const client = await pool.connect();

  try {
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await client.query('BEGIN');

    const result: QueryResult = await client.query(
      SQL_CREATE_SUPER_ADMIN_USER,
      // TODO: where do we create the username
      ['Site Owner Person', email, hashedPassword, 'super_admin']
    );

    const userId = result.rows[0]?.id;

    if (!userId) {
      throw new Error('Failed to create super admin user');
    }

    const token = getUniqueToken();

    await client.query(SQL_CREATE_PASSWORD_RESET_REQUEST, [
      token,
      userId,
      email,
      '48 hours',
    ]);

    await client.query('COMMIT');
    return { token };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating super admin user: ', err);
    throw err;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  const pool = getPool();

  try {
    console.log('Checking for existing super admin...');
    const superAdminExists = await checkSuperAdminExists(pool);

    if (superAdminExists) {
      console.log('Super Admin user already exists, skipping creation');
    } else {
      const superAdminEmail = validateSuperAdminEmail(
        process.env.SUPER_ADMIN_EMAIL
      );
      console.log(
        'No super admin found, creating default super admin user for: ',
        superAdminEmail
      );
      const { token } = await createProductionSuperAdmin({
        pool,
        email: superAdminEmail,
      });
      console.log('Sending super_admin account setup to ', superAdminEmail);

      try {
        const emailResult = await sendSuperAdminSetupEmail({
          to: superAdminEmail,
          verificationToken: token,
        });

        if (!emailResult.success) {
          const failedSendErrorMsg = `Failed to send email: ${emailResult.error?.message || 'Unknown Error'}`;
          throw new Error(failedSendErrorMsg);
        }

        console.log('Setup email sent sucessfully');
      } catch (emailErr) {
        console.error('Failed to send super admin setup email: ', emailErr);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Production super admin setup failed: ', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unhandled error in admin-setup-prod.ts: ', err);
  process.exit(1);
});
