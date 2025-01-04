import { runHelmet } from "./runHelmet";
import { composeMiddleware } from './composeMiddleware';

if ( !process.env.INTERNAL_CLIENT_URL ) {
  console.error('INTERNAL_CLIENT_URL missing from env variables, explicitly required for local (non-docker) environment');
  process.exit(1);
}

export const apiMiddleware = composeMiddleware(
  runHelmet
);
