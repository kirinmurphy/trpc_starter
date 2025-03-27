import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getPool } from '../../src/server/db/pool';
import { checkSuperAdminExists } from './utils/checkSuperAdminExists';
import { PoolClient, QueryResult } from 'pg';
import {
  SQL_CREATE_PASSWORD_RESET_REQUEST,
  SQL_CREATE_SUPER_ADMIN_USER,
} from '../../src/server/db/sql';
import { getUniqueToken } from '../../src/server/authentication/utils/getUniqueToken';
import { validateSuperAdminEmail } from './utils/validateSuperAdminEmail';
import { sendSuperAdminSetupEmail } from './utils/sendSuperAdminSetupEmail';

async function main(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log('Checking for existing super admin...');

    const superAdminExists = await checkSuperAdminExists(pool);

    if (superAdminExists) {
      console.log('Super Admin user already exists, skipping creation');
      return;
    }

    const email = validateSuperAdminEmail(process.env.SUPER_ADMIN_EMAIL);

    console.log('No super admin found, creating for: ', email);

    await client.query('BEGIN');

    const { verificationToken } = await createProdSuperAdmin({ client, email });

    await handleSendingSuperAdminEmail({ to: email, verificationToken });

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');

    throw new Error(`Production super admin setup failed: ${err.message}`);
  } finally {
    client.release();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Unhandled error in admin-setup-prod.ts: ', err);
    process.exit(1);
  });
}

interface CreateProductionSuperAdminProps {
  client: PoolClient;
  email: string;
}

async function createProdSuperAdmin(
  props: CreateProductionSuperAdminProps
): Promise<{ verificationToken: string }> {
  const { client, email } = props;

  try {
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result: QueryResult = await client.query(
      SQL_CREATE_SUPER_ADMIN_USER,
      // TODO: where should we create the username
      ['Site Owner Person', email, hashedPassword, 'super_admin']
    );

    const userId = result.rows[0]?.id;

    if (!userId) {
      throw new Error('Failed to create super admin user');
    }

    const verificationToken = getUniqueToken();

    await client.query(SQL_CREATE_PASSWORD_RESET_REQUEST, [
      verificationToken,
      userId,
      email,
      '48 hours',
    ]);

    return { verificationToken };
  } catch (err) {
    throw new Error(`Error creating super admin user: ${err.message}`);
  }
}

async function handleSendingSuperAdminEmail(props: {
  to: string;
  verificationToken: string;
}) {
  console.log('Sending super_admin account setup to: ', props.to);

  try {
    const emailResult = await sendSuperAdminSetupEmail(props);

    if (!emailResult.success) {
      const failedSendErrorMsg = `Failed to send email: ${emailResult.error?.message || 'Unknown Error'}`;
      throw new Error(failedSendErrorMsg);
    }

    console.log('Setup email sent sucessfully');
  } catch (emailErr) {
    throw new Error(
      `Failed to send super admin setup email: ${emailErr.message}`
    );
  }
}
