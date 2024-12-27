import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "stage", "test"])
    .default("development"),
  STORAGE_ENDPOINT: z.string(),
  STORAGE_PORT: z.coerce.number(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
  STORAGE_USE_SSL: z.coerce.boolean().default(false),
  STORAGE_DEFAULT_BUCKET_NAME: z.string(),
});

const getEnv = envSchema.safeParse(process.env);

if (!getEnv.success) {
  const errorMessage = "load environment failed";
  console.error(errorMessage, getEnv.error.format());
  throw new Error(errorMessage);
}

export const env = getEnv.data;
