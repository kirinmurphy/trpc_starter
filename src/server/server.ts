import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { getPool } from './db/pool';
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

const port = parseInt(process.env.API_PORT || '3000');
const host = process.env.API_HOST || '0.0.0.0';
const protocol = process.env.API_PROTOCOL || 'http';

server.listen(port, host);
console.log(`Server running on ${protocol}://${host}:${port}`);

process.on('SIGINT', () => {
  getPool().end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export type AppRouter = typeof appRouter;
