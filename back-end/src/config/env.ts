import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  HOST: z.string().default('0.0.0.0'),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().default('6379'),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.string().default('9000'),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.string().default('12'),
});

export const env = envSchema.parse(process.env);