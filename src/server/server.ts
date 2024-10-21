import cors from 'cors';
// import z from 'zod';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { pool } from './db/pool';
import { router } from "./router";
// import { publicProcedure, router } from "./router";
import { authRouter } from './authentication/authRouter';
import { createContext } from './authentication/context';
// import { ContextType } from './authentication/types';

export const appRouter = router({
  auth: authRouter,
  // someAuthenticatedEndpoint: publicProcedure
  //   .input(z.void())
  //   .query(async ({ ctx }: { ctx: ContextType }) => {
  //     // This procedure is already protected by the authenticatedProcedure,
  //     // so if we reach here, the user is authenticated

  //     // You can access the authenticated user's ID from the context if needed
  //     const userId = ctx.user?.id;

  //     return {
  //       message: "This is a protected endpoint",
  //       userId: userId,
  //       serverTime: new Date().toISOString()
  //     };
  //   }),
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
