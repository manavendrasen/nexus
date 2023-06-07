import Redis from "ioredis";

export const getRedisUrl = () => {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  else throw new Error("Redis URL not found");
};
