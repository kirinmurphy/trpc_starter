import fs from 'fs';
import path from 'path';
import { SYSTEM_STATUS } from './types';

interface SystemStatusData {
  systemStatus: SYSTEM_STATUS;
  updatedAt: string;
  adminEmail?: string;
}

const SYSTEM_STATUS_DIR = path.join(process.cwd(), 'docker', 'system_status');
const SYSTEM_STATUS_FILE = path.join(SYSTEM_STATUS_DIR, 'system_status.json');
const NGINX_STATUS_FILE = path.join(
  SYSTEM_STATUS_DIR,
  'nginx_block_admin_setup'
);

export function ensureSystemStatusDirectory(): void {
  if (!fs.existsSync(SYSTEM_STATUS_DIR)) {
    fs.mkdirSync(SYSTEM_STATUS_DIR, { recursive: true });
  }
}

export function systemStatusExists() {
  return fs.existsSync(SYSTEM_STATUS_FILE);
}

export function readSystemStatus(): SystemStatusData | null {
  ensureSystemStatusDirectory();
  if (!systemStatusExists()) {
    return null;
  }

  try {
    const data = fs.readFileSync(SYSTEM_STATUS_FILE, 'utf8');
    return JSON.parse(data) as SystemStatusData;
  } catch (err) {
    console.error('Error reading app state: ', err);
    return null;
  }
}

export function writeSystemStatus(
  systemStatus: SYSTEM_STATUS,
  adminEmail?: string
): boolean {
  ensureSystemStatusDirectory();
  try {
    const systemStatusData: SystemStatusData = {
      systemStatus,
      updatedAt: new Date().toISOString(),
      ...(adminEmail && { adminEmail }),
    };

    const jsonStatus = JSON.stringify(systemStatusData, null, 2);
    fs.writeFileSync(SYSTEM_STATUS_FILE, jsonStatus, 'utf8');

    if (systemStatus === SYSTEM_STATUS.READY) {
      fs.writeFileSync(NGINX_STATUS_FILE, '', 'utf8');
    } else if (fs.existsSync(NGINX_STATUS_FILE)) {
      fs.unlinkSync(NGINX_STATUS_FILE);
    }
    return true;
  } catch (err) {
    console.error('Error writing app state:', err);
    return false;
  }
}

export function getCurrentSystemStatus(): SYSTEM_STATUS {
  const systemStatusData = readSystemStatus();

  if (!systemStatusData) {
    return SYSTEM_STATUS.IN_PROGRESS;
  }

  return systemStatusData.systemStatus;
}

export function isSystemReady(): boolean {
  return getCurrentSystemStatus() === SYSTEM_STATUS.READY;
}
