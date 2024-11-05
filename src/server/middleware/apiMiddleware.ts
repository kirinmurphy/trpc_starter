import cors from 'cors';
import { runHelmet } from "./runHelmet";
import { composeMiddleware } from './composeMiddleware';

if ( !process.env.CLIENT_URL ) {
  console.error('CLIENT_URL missing from env variables, explicitly required for local (non-docker) environment');
  process.exit(1);
}

const corsMiddleware = cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['content-type', 'x-csrf-token'],
  exposedHeaders: ['x-csrf-token', 'X-Csrf-Token'],
});

export const apiMiddleware = composeMiddleware(
  corsMiddleware,
  runHelmet
);
