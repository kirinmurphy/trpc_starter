import { createTestPool } from './db';

const pool = createTestPool();

export async function getVerificationToken({ email }) {
  return await getTokenFromDB({ email, table: 'verification_tokens' });
}

export async function getPasswordResetToken({ email }) {
  return await getTokenFromDB({ email, table: 'reset_password_tokens' });
}

async function getTokenFromDB({ email, table }) {
  const query = `SELECT token FROM ${table} WHERE email = $1 ORDER BY expires_at DESC LIMIT 1`;
  const result = await pool.query(query, [email]);
  return result.rows[0]?.token || null;
}
