import cors from 'cors';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { pool } from './db/pool';
import { router } from "./router";
import { authRouter } from './authentication/authRouter';
import { createContext } from './authentication/context';

export const appRouter = router({
  auth: authRouter,
});


const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({
    origin: 'http://localhost:5173', 
    credentials: true
  })
});

server.listen(3000);
console.log('Server running on port 3000');

process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export type AppRouter = typeof appRouter;
