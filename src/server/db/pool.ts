import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

// TODO: add validation that env variables exist and exit out of process if not
const appDbName = isTestEnv ? process.env.TEST_DB_NAME! : process.env.DB_NAME!;

export const getPool = (function () {
  let pool: Pool | null  = null;  
  return () => {
    pool = pool || createPool({ dbName: appDbName });
    return pool;
  };
})();


export function createPool ({ dbName }: { dbName: string }) {
  return new Pool({
    user: process.env.DB_USER,
    host: 'db',
    database: dbName,
    password: process.env.DB_PASSWORD,
    port: 5432
  });
}


export async function testConnection() {
  const pool = getPool();
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Error connecting to the database', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}
