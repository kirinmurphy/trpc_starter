import cors from 'cors';
import { IncomingMessage, ServerResponse } from 'http';
import type { ParsedQs } from 'qs';
import { runHelmet } from "./runHelmet";

type NodeHTTPRequest = IncomingMessage & { 
  query?: ParsedQs;
  body?: unknown;
};

export function getMiddleware (
  req: NodeHTTPRequest, 
  res: ServerResponse, 
  next: () => void
) {  
  runHelmet(req, res, (err: unknown) => {
    if ( err ) {
      console.error('Helmet middleware error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    cors({
      origin: process.env.CLIENT_URL, 
      credentials: true
    })(req, res, next);
  });
}
