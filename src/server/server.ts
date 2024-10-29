import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { pool } from './db/pool';
import { procedures, router } from "./trpcRouter";
import { authRouter } from './authentication/authRouter';
import { createContext } from './authentication/createContext';
import { apiMiddleware } from './middleware/apiMiddleware';

export const appRouter = router({
  ping: procedures.publicQuery.query(() => 'pong'),
  auth: authRouter,
});

const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: apiMiddleware
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || '0.0.0.0'; 

server.listen(port, host);
console.log('Server running on port 3000');

process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export type AppRouter = typeof appRouter;
