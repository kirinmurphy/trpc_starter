const { createTestPool } = require('./db.cjs');

const pool = createTestPool();

async function getVerificationToken ({ email }) {
  const result = await pool.query(
    'SELECT token FROM verification_tokens WHERE email = $1 ORDER BY expires_at DESC LIMIT 1',
    [email]
  );
  return result.rows[0]?.token || null;

}

module.exports = {
  getVerificationToken
}