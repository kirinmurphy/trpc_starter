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
import { validateSuperAdminEmailFormat } from './utils/validateSuperAdminEmailFormat';
import { sendSuperAdminSetupEmail } from './utils/sendSuperAdminSetupEmail';
import { writeSystemStatus } from '../../src/server/systemStatus/systemStatus';
import { SYSTEM_STATUS } from '../../src/server/systemStatus/types';

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

async function main(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log('Checking for existing SuperAdmin...');

    const superAdminExists = await checkSuperAdminExists(pool);

    if (superAdminExists) {
      console.log('SuperAdmin user already exists, skipping creation');
      return;
    }

    console.log('SuperAdmin not found, creating for: ', superAdminEmail);

    const email = validateSuperAdminEmailFormat(superAdminEmail);

    await client.query('BEGIN');

    const { verificationToken } = await createProdSuperAdmin({ client, email });

    await handleSendingSuperAdminEmail({ to: email, verificationToken });

    await client.query('COMMIT');

    const systemStatusUpdated = writeSystemStatus(
      SYSTEM_STATUS.IN_PROGRESS,
      email
    );
    if (systemStatusUpdated) {
      console.log('App state set to IN_PROGRESS');
    } else {
      console.warn('Failed to set app state to IN_PROGRESS');
    }
  } catch (err) {
    await client.query('ROLLBACK');

    throw new Error(`PRODUCTION BUILD FAILED: ${err.message}`);
  } finally {
    client.release();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
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
      // TODO: Remove after make registration UI workflow
      ['Unverified SuperAdmin', email, hashedPassword, 'super_admin']
    );

    const userId = result.rows[0]?.id;

    if (!userId) {
      throw new Error('Failed to create SuperAdmin user');
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
    throw new Error(`Error creating SuperAdmin user: ${err.message}`);
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
    const errMsg = `Failed to send SuperAdmin setup email: ${emailErr.message}`;
    throw new Error(errMsg);
  }
}
