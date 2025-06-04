const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { createTestPool } = require('./db.cjs');

const SYSTEM_STATUS_DIR = path.join('/app/docker/system_status');
const SYSTEM_STATUS_FILE = path.join(SYSTEM_STATUS_DIR, 'system_status.json');
const NGINX_STATUS_FILE = path.join(
  SYSTEM_STATUS_DIR,
  'nginx_block_admin_setup'
);

async function getNewSuperAdminToken() {
  const testPool = createTestPool();
  const client = await testPool.connect();

  try {
    const userResult = await client.query(
      "SELECT id, email FROM users WHERE role = 'super_admin'"
    );
    const { id: userId, email } = userResult.rows[0];
    const token = crypto.randomBytes(32).toString('base64url');

    const result = await client.query(
      'INSERT INTO reset_password_tokens (token, user_id, email, expires_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP + $4::interval)',
      [token, userId, email, '48 hours']
    );

    return { token, userId, email };
  } finally {
    client.release();
    await testPool.end();
  }
}

async function deleteMockPasswordTokens() {
  const testPool = createTestPool();
  const client = await testPool.connect();
  try {
    await client.query('DELETE FROM reset_password_tokens');
    return true;
  } finally {
    client.release();
    await testPool.end();
  }
}


function writeSystemStatusToReady() {
  return writeSystemStatusTo('ready');
}

function writeSystemStatusToInProgress() {
  return writeSystemStatusTo('in-progress');
}


module.exports = {
  getNewSuperAdminToken,
  deleteMockPasswordTokens,
  writeSystemStatusToInProgress,
  writeSystemStatusToReady,
};


function writeSystemStatusTo(status) {
  if (!fs.existsSync(SYSTEM_STATUS_DIR)) {
    fs.mkdirSync(SYSTEM_STATUS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    SYSTEM_STATUS_FILE,
    JSON.stringify({ systemStatus: status }, null, 2),
    'utf8'
  );

  if (fs.existsSync(NGINX_STATUS_FILE)) {
    fs.unlinkSync(NGINX_STATUS_FILE);
  }

  return true;
}