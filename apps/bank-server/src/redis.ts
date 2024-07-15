// src/redis.ts
import { createClient } from 'redis';
import { REDIS_URL } from '.';

const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  await redisClient.connect();
  console.log('Connected to Redis');
}

connectRedis();

export default redisClient;
