import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { getPool } from './db/pool';
import { procedures, router } from './trpcRouter';
import { authRouter } from './authentication/authRouter';
import { createContext } from './authentication/createContext';
import { apiMiddleware } from './middleware/apiMiddleware';

const apiRouter = router({
  ping: procedures.publicQuery.query(() => 'pong'),
  auth: authRouter,
});

export const appRouter = router({
  api: apiRouter,
});

const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: apiMiddleware,
});

const port = 3000;
const host = '0.0.0.0';

server.listen(port, host);
console.log(`Server running on https://${host}:${port}`);

process.on('SIGINT', () => {
  getPool()
    .end()
    .then(() => {
      console.log('Database pool has ended');
      process.exit(0);
    });
});

export type AppRouter = typeof appRouter;
