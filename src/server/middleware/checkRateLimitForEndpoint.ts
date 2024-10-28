import { RateLimitProps } from "../rateLimitConfig";
import { ContextType } from "../authentication/types";
import { redis } from "../redisClient";
import { TRPCError } from "@trpc/server";

export function checkRateLimitFor (config: RateLimitProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function ({ ctx, next }: { ctx: ContextType, next: () => Promise<any> }) {
    const ip = getUserIp(ctx);
    const redisKey = `${config.name}:${ip}`;
    await checkRateLimit({ redisKey, config });
    return next();
  }
}

function getUserIp (ctx: ContextType) {
  return ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress;
}

async function checkRateLimit ({ redisKey, config }: { redisKey: string; config: RateLimitProps }) {
  try {
    const prefixedKey = `rateLimit:${redisKey}`;
    const blockedKey = `${prefixedKey}:blocked`;
    console.log('now', prefixedKey, config);

    const multi = redis.multi();

    multi.get(blockedKey);
    multi.get(prefixedKey);

    const results = await multi.exec();
    if ( !results ) {
      throw new Error('Redis transaction failed.');
    }

    const [[blockError, isBlocked], [attemptError, attempts]] = results;  

    if ( blockError || attemptError ) {
      throw new Error('Redis command failed.');
    }

    if ( isBlocked ) {
      const ttl = await redis.ttl(blockedKey);
      const nextRetryChance = Math.ceil(ttl / 60);
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Too many attempts.  Please try again in ${nextRetryChance} minutes`
      });
    }

    const currentAttempts = attempts ? parseInt(attempts as string) : 0;

    if ( currentAttempts >= config.hits ) {
      await redis.setex(blockedKey, config.blockDuration*60, '1');
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Too many attempts.  Please try again in ${config.blockDuration} minutes`
      });
    }

    const updateMulti = redis.multi();

    if ( currentAttempts === 0 ) {
      updateMulti.setex(prefixedKey, config.duration*60, '1');
    } else {
      updateMulti.incr(prefixedKey);
    }

    await updateMulti.exec();
  } catch ( err: unknown ) {
    console.error('Rate limiting error: ', err);

    if ( err instanceof TRPCError ) throw err;
    // TODO: what's the user friendly recourse here? 
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Rate limiting service unavailable'
    });
  }
}


