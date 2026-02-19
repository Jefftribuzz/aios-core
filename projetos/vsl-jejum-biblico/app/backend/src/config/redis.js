import { createClient } from 'redis';
import pino from 'pino';

const logger = pino();
let redisClient;

export async function initRedis() {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    logger.warn('REDIS_URL not set. Running without Redis caching.');
    return null;
  }

  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
  });

  redisClient.on('error', (err) => logger.error('Redis error:', err));
  redisClient.on('connect', () => logger.info('Redis connected'));

  await redisClient.connect();
  return redisClient;
}

export function getRedis() {
  return redisClient;
}

export async function cacheGet(key) {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
}

export async function cacheSet(key, value, ttl = 3600) {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Cache set error:', error);
    return false;
  }
}

export async function cacheDel(key) {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Cache del error:', error);
    return false;
  }
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
}
