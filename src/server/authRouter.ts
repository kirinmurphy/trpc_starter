import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import cookie from 'cookie';
import { z } from "zod";
import { IncomingMessage, ServerResponse } from 'http';
import { pool } from "./db/pool";
import { publicProcedure, router, createContext } from "./router";
import { inferAsyncReturnType } from '@trpc/server';

export type Context = inferAsyncReturnType<typeof createContext>

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const COOKIE_NAME = 'auth_token';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const result = await pool.query(
          'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id',
          [name, email, hashedPassword]
        );
        const userId = result.rows[0].id;
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

        setAuthCookie(ctx.res, token);

        return { success: true, userId };
      } catch (err) {
        console.log('auth error', err);
        return { success: false, error: 'Registration failed' };
      }
    }),
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const { email, password } = input;

      try {
        const result = await pool.query('SELECT * FROM members WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return { success: false, error: 'Invalid password' }
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
        return { success: true, token }
      } catch (err) { 
        console.error('Login error: ', err);
        return { success: false, error: 'Login failed' };
      }
    }),

  logout: publicProcedure 
    .mutation(({ ctx }) => {
      clearAuthCookie(ctx.res);
      return { success: true }
    })
});

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
} as const;

function setAuthCookie (res: ServerResponse, token: string) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    ...cookieDefaults,
    maxAge: 86400,
  }));
}

function clearAuthCookie (res: ServerResponse) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    ...cookieDefaults,
    maxAge: 0,
  }));
}

export async function authenticateUser (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: () => void
) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'No token provided' }));
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    console.error('error: ', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid token' }));
  }
}
