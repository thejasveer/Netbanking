// src/redis.ts
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  await redisClient.connect();
  console.log('Connected to Redis');
}

connectRedis();

export default redisClient;
