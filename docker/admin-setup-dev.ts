import bcrypt from 'bcrypt';
import { Pool, QueryResult } from 'pg';
import { getPool } from '../src/server/db/pool';

export const DEV_SUPER_ADMIN = {
  name: 'Dev Admin',
  email: 'admin@local.dev',
  password: 'admin123',
  role: 'super_admin',
};

async function checkSuperAdminExists(pool: Pool) {
  try {
    const result: QueryResult = await pool.query(
      'SELECT id FROM users WHERE role = $1 LIMIT 1',
      [DEV_SUPER_ADMIN.role]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking for super admin:', err);
    throw err;
  }
}

async function createSuperAdmin(pool: Pool) {
  try {
    const hashedPassword = await bcrypt.hash(DEV_SUPER_ADMIN.password, 10);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result: QueryResult = await client.query(
        'INSERT INTO users (name, email, password, role, verified) VALUES ($1, $2, $3, $4, true) RETURNING id',
        [
          DEV_SUPER_ADMIN.name,
          DEV_SUPER_ADMIN.email,
          hashedPassword,
          DEV_SUPER_ADMIN.role,
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
    console.error('Error creating super admin: ', err);
    throw err;
  }
}

async function main(): Promise<void> {
  const pool = getPool();

  try {
    console.log('Checking for existing super admin...');
    const superAdminExists = await checkSuperAdminExists(pool);

    if (superAdminExists) {
      console.log('Super admin user already exists, skipping creation');
    } else {
      console.log('No super admin found, creating default super admin user...');
      await createSuperAdmin(pool);
      console.log('Dev environment setup complete');
    }
  } catch (err) {
    console.error('Dev setup failed: ', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unhandled error in dev-setup.ts: ', err);
  process.exit(1);
});
