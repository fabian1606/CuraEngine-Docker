import dotenv from 'dotenv';
import { dirname } from "path";

dotenv.config();

export const {
  PORT,
  API_KEY,
  API_URL,
  CORS_ORIGN,
} = process.env as { [key: string]: string };

export const APP_DIR = dirname(require.main!.filename)

