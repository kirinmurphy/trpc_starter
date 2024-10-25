import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_NAME : process.env.DB_NAME,
});

export async function testConnection() {
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
