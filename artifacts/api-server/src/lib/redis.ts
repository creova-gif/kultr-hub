import { createClient, type RedisClientType } from "redis";
import { RedisStore } from "rate-limit-redis";
import { logger } from "./logger.js";

// Rate limiting defaults to an in-process MemoryStore, which resets on every
// restart and doesn't share state across instances. With REDIS_URL set, hit
// counts persist across restarts and are shared by every server instance.
export const redisClient: RedisClientType | null = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : null;

redisClient?.on("error", (err) => logger.error({ err }, "Redis client error"));

export async function connectRedis(): Promise<void> {
  if (redisClient) await redisClient.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) await redisClient.quit();
}

export function createRateLimitStore(prefix: string): RedisStore | undefined {
  if (!redisClient) return undefined;
  return new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix,
  });
}
