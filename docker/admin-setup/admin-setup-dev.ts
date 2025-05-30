import bcrypt from 'bcrypt';
import { Pool, QueryResult } from 'pg';
import { getPool } from '../../src/server/db/pool';
import { checkSuperAdminExists } from './utils/checkSuperAdminExists';
import { SQL_CREATE_SUPER_ADMIN_USER } from '../../src/server/db/sql';
import { writeSystemStatus } from '../../src/server/systemStatus/systemStatus';
import { DEV_SUPER_ADMIN } from './utils/superAdminDevFakeCredentials';
import { SYSTEM_STATUS } from '../../src/server/systemStatus/types';

async function main(): Promise<void> {
  const pool = getPool();

  try {
    console.log('Checking for existing super admin...');
    const superAdminExists = await checkSuperAdminExists(pool);

    if (superAdminExists) {
      console.log('Super admin user already exists, skipping creation');
    } else {
      console.log('No super admin found, creating default super admin user...');
      await createDevSuperAdmin(pool);
      console.log('Dev super admin setup complete');
    }

    const systemStatusUpdated = writeSystemStatus(SYSTEM_STATUS.READY);

    if (systemStatusUpdated) {
      console.log('App state set to READY');
    } else {
      console.warn('Failed to set app state to READY');
    }
  } catch (err) {
    console.error('❌ Dev setup failed: ', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Unhandled error in dev-setup.ts: ', err);
    process.exit(1);
  });
}

async function createDevSuperAdmin(pool: Pool) {
  try {
    const hashedPassword = await bcrypt.hash(DEV_SUPER_ADMIN.password, 10);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result: QueryResult = await client.query(
        SQL_CREATE_SUPER_ADMIN_USER,
        [
          DEV_SUPER_ADMIN.username,
          DEV_SUPER_ADMIN.email,
          hashedPassword,
          'super_admin',
        ]
      );

      const userId = result.rows[0]?.id;
      if (!userId) {
        throw new Error('failed to create super admin user');
      }

      await client.query('COMMIT');
      console.log('Super admin created with ID', userId);
      return userId;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Error creating super admin: ', err);
    throw err;
  }
}
