import { NodeHTTPRequest } from '@trpc/server/adapters/node-http';
import { ServerResponse } from 'http';
import { APP_STATE, isAppReady } from '../appState/appState';

export function appStateMiddleware(
  req: NodeHTTPRequest,
  res: ServerResponse,
  next: () => void
) {
  const appState = isAppReady() ? APP_STATE.READY : APP_STATE.IN_PROGRESS;
  res.setHeader('X-App-State', appState);
  next();
}
