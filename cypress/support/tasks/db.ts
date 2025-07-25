import 'dotenv/config';
import { Pool } from 'pg';

export async function cleanupTestUsers() {
  const testPool = createTestPool();
  const client = await testPool.connect();

  try {
    await client.query(`
      DELETE FROM users
      WHERE email LIKE 'test%@%'  
    `);
  } finally {
    client.release();
    await testPool.end();
  }
}

export async function verifyTestEnvironment() {
  const testPool = createTestPool();
  const client = await testPool.connect();

  try {
    const { rows } = await client.query('SELECT current_database()');
    const dbName = rows[0].current_database;
    if (!dbName.includes('_cypress')) {
      throw new Error(
        'Tests must run against a test database. Current database: ' + dbName
      );
    }
  } finally {
    client.release();
    await testPool.end();
  }
}

export function createTestPool() {
  return new Pool({
    user: process.env.DB_USER,
    host: 'db',
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: process.env.TEST_DB_NAME,
  });
}
