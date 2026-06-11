import Redis from 'ioredis';
import { env } from '@/config/env';

const redis = new Redis({ host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT, 10), lazyConnect: true });
const pubRedis = new Redis({ host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT, 10), lazyConnect: true });
const dataRedis = new Redis({ host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT, 10), lazyConnect: true });

redis.on('error', (err) => console.error('Sub Redis error:', err));
pubRedis.on('error', (err) => console.error('Pub Redis error:', err));
dataRedis.on('error', (err) => console.error('Data Redis error:', err));

export async function connectRedis() {
  await redis.connect();
  await pubRedis.connect();
  await dataRedis.connect();
  console.log('Connected to Redis (sub + pub + data)');
  return { redis, pubRedis, dataRedis };
}

export { pubRedis, dataRedis };
export default redis;