import cors from 'cors';
import { runHelmet } from "./runHelmet";
import { composeMiddleware } from './composeMiddleware';

const corsMiddleware = cors({
  origin: [process.env.CLIENT_URL!, 'http://app:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['content-type', 'x-csrf-token'],
  exposedHeaders: ['x-csrf-token', 'X-Csrf-Token'],
});

export const apiMiddleware = composeMiddleware(
  corsMiddleware,
  runHelmet
);
