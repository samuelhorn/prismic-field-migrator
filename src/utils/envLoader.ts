import { config } from "dotenv";
import path from "path";

export function loadEnvConfig() {
  const result = config({
    path: path.resolve(process.cwd(), ".env.local"),
  });

  if (result.error) {
    throw new Error("Failed to load .env.local file");
  }
}
