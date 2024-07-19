// src/redis.ts
import Redis from 'ioredis';
import dotenv from "dotenv";
// import { REDIS_URL } from './index';
dotenv.config({ path: "./../../.env " })
console.log("redis",process.env.REDIS_URL)
const redisClient = new Redis(process.env.REDIS_URL || "");

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export default redisClient;