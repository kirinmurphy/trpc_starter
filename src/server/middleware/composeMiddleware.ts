import { NodeHTTPRequest } from '@trpc/server/adapters/node-http';
import { ServerResponse } from 'http';

type MiddlewareFunction = (
  req: NodeHTTPRequest,
  res: ServerResponse,
  next: () => void
) => void;

export function composeMiddleware(...middlewares: MiddlewareFunction[]) {
  return async (
    req: NodeHTTPRequest,
    res: ServerResponse,
    next: () => void
  ) => {
    try {
      for (const middleware of middlewares) {
        await promisifyMiddleware(middleware)(req, res);
      }
      next();
    } catch (err: unknown) {
      console.error('Middleware error: ', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  };
}

function promisifyMiddleware(middleware: MiddlewareFunction) {
  return (req: NodeHTTPRequest, res: ServerResponse) => {
    return new Promise<void>((resolve, reject) => {
      middleware(req, res, (err?: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}
