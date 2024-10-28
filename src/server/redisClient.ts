import { createClient, RedisClientType } from 'redis';
import { z } from 'zod';

const redisEnvSchema = z.object({
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  REDIS_PASSWORD: z.string()
});

const env = redisEnvSchema.parse(process.env);

console.log('Initializing Redis connection...');

// Create client with minimal configuration
const redis: RedisClientType = createClient({
  username: 'default',
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    tls: true,
    reconnectStrategy: false // Disable auto-reconnect
  }
});

let connectionStatus = 'initializing';
let connectionError: Error | null = null;

redis.on('connect', () => {
  connectionStatus = 'connecting';
  console.log('Redis: Socket connected');
});

redis.on('ready', () => {
  connectionStatus = 'ready';
  console.log('Redis: Connection established and ready');
});

redis.on('error', (err: Error) => {
  connectionStatus = 'error';
  connectionError = err;
  console.error('Redis error:', {
    message: err.message,
    name: err.name,
    stack: err.stack
  });
});

redis.on('end', () => {
  connectionStatus = 'closed';
  console.log('Redis: Connection closed');
});

async function testConnection(): Promise<boolean> {
  console.log('\nStarting connection test...');
  
  try {
    console.log('Attempting connection...');
    await redis.connect();
    console.log('Connection established');
    
    const pong = await redis.ping();
    console.log('PING response:', pong);
    return pong === 'PONG';
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

async function closeRedis() {
  console.log('Closing Redis connection...');
  try {
    // Don't use Promise.race here, just disconnect
    await redis.disconnect();
    console.log('Redis connection closed successfully');
  } catch (err) {
    console.error('Error during close:', err);
  }
}

// Handle process termination
process.on('SIGTERM', closeRedis);
process.on('SIGINT', closeRedis);

if (require.main === module) {
  console.log('Starting Redis test suite...');
  
  testConnection()
    .then(async (success) => {
      if (!success) {
        console.error('\nConnection test failed:', {
          status: connectionStatus,
          error: connectionError?.message
        });
      } else {
        console.log('\nConnection test successful!');
      }
      await closeRedis();
      process.exit(success ? 0 : 1);
    })
    .catch(async (err) => {
      console.error('Fatal error:', err);
      await closeRedis();
      process.exit(1);
    });
}

export { redis, testConnection, closeRedis };