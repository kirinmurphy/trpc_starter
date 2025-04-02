import { runHelmet } from './runHelmet';
import { composeMiddleware } from './composeMiddleware';
import { appStateMiddleware } from './appStateMiddleware';

if (!process.env.INTERNAL_CLIENT_URL) {
  console.error(
    'INTERNAL_CLIENT_URL missing from env variables, explicitly required for local (non-docker) environment'
  );
  process.exit(1);
}

export const apiMiddleware = composeMiddleware(appStateMiddleware, runHelmet);
