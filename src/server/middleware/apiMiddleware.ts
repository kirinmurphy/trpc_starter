import cors from 'cors';
import { runHelmet } from "./runHelmet";
import { composeMiddleware } from './composeMiddleware';

if ( !process.env.INTERNAL_CLIENT_URL ) {
  console.error('INTERNAL_CLIENT_URL missing from env variables, explicitly required for local (non-docker) environment');
  process.exit(1);
}

const corsMiddleware = cors({
  origin: "http://localhost", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['content-type', 'x-csrf-token'],
  exposedHeaders: ['x-csrf-token', 'X-Csrf-Token'],
});

export const apiMiddleware = composeMiddleware(
  corsMiddleware,
  runHelmet
);
