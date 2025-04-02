import fs from 'fs';
import path from 'path';

export enum APP_STATE {
  IN_PROGRESS = 'in-progress',
  READY = 'ready',
}

interface AppStateData {
  state: APP_STATE;
  updatedAt: string;
  adminEmail?: string;
}

const APP_STATE_DIR = path.join(process.cwd(), 'docker', 'app_state');
const APP_STATE_FILE = path.join(APP_STATE_DIR, 'app_state.json');

export function ensureAppStateDirectory(): void {
  if (!fs.existsSync(APP_STATE_DIR)) {
    fs.mkdirSync(APP_STATE_DIR, { recursive: true });
  }
}

export function appStateExists() {
  return fs.existsSync(APP_STATE_FILE);
}

export function readAppState(): AppStateData | null {
  ensureAppStateDirectory();
  if (!appStateExists()) {
    // TODO: dead end?
    return null;
  }

  try {
    const data = fs.readFileSync(APP_STATE_FILE, 'utf8');
    return JSON.parse(data) as AppStateData;
  } catch (err) {
    console.error('Error reading app state: ', err);
    return null;
  }
}

export function writeAppState(state: APP_STATE, adminEmail?: string): boolean {
  ensureAppStateDirectory();
  try {
    const appState: AppStateData = {
      state,
      updatedAt: new Date().toISOString(),
      ...(adminEmail && { adminEmail }),
    };

    const fileName = JSON.stringify(appState, null, 2);
    fs.writeFileSync(APP_STATE_FILE, fileName, 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing app state:', err);
    return false;
  }
}

export function getCurrentAppState(): APP_STATE {
  const appState = readAppState();

  if (!appState) {
    return APP_STATE.IN_PROGRESS;
  }

  return appState.state;
}

export function isAppReady(): boolean {
  return getCurrentAppState() === APP_STATE.READY;
}
