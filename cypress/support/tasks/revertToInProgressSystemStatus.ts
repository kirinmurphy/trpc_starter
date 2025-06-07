import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { createTestPool } from './db';

const SYSTEM_STATUS_DIR = path.join('/app/docker/system_status');
const SYSTEM_STATUS_FILE = path.join(SYSTEM_STATUS_DIR, 'system_status.json');
const NGINX_STATUS_FILE = path.join(
  SYSTEM_STATUS_DIR,
  'nginx_block_admin_setup'
);

interface SuperAdminTokenResult {
  token: string;
  userId: string;
  email: string;
}

export async function getNewSuperAdminToken(): Promise<SuperAdminTokenResult> {
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

export async function deleteMockPasswordTokens(): Promise<boolean> {
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

export function writeSystemStatusToReady(): boolean {
  return writeSystemStatusTo('ready');
}

export function writeSystemStatusToInProgress(): boolean {
  return writeSystemStatusTo('in-progress');
}

function writeSystemStatusTo(status): boolean {
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
