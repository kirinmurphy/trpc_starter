const { createTestPool } = require('./db.cjs');

const pool = createTestPool();

async function getVerificationToken ({ email }) {
  return await getTokenFromDB({ email, table: 'verification_tokens' });
}

async function getPasswordResetTokenImpl ({ email }) {
  return await getTokenFromDB({ email, table: 'reset_password_tokens' });
}

async function getTokenFromDB ({ email, table }) {
  const query = `SELECT token FROM ${table} WHERE email = $1 ORDER BY expires_at DESC LIMIT 1`;
  const result = await pool.query(query, [email]);
  return result.rows[0]?.token || null;
}

module.exports = {
  getVerificationToken,
  getPasswordResetTokenImpl
};
