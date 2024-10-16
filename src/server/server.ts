import cors from 'cors';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router } from "./router";
import { addExternalRoute } from "./utils/addExternalRoute";
import { marsRovePicsEndpoint } from "./externalApis/marsRoverPicsEndpoint";
import { issLocationEndpoint } from "./externalApis/issLocationEndpoint";
import { issAstronautsEndpoint } from "./externalApis/issAstronautsEndpoint";
import { nasaDailySpaceEndpoint } from "./externalApis/nasaDailySpaceEndpoint";
import { pool, testConnection } from './db/pool';
import { authRouter } from './authRouter';

export const appRouter = router({
  getMarsRoverPics: await addExternalRoute({ endpoint: marsRovePicsEndpoint }),
  getNasaDailySpace: await addExternalRoute({ endpoint: nasaDailySpaceEndpoint }),
  getAstronautsOnISS: await addExternalRoute({ endpoint: issAstronautsEndpoint }),
  getISSLocation: await addExternalRoute({ endpoint: issLocationEndpoint }),
  auth: authRouter
});

testConnection();

const server = createHTTPServer({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res }),
  middleware: cors()
});

server.listen(3000);
console.log('Server running on port 3001');

process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export type AppRouter = typeof appRouter;
