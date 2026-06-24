import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.resolve(__dirname, "../../.env");

export function loadEnvFile(envPath = ENV_PATH) {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        return [
          line.slice(0, separatorIndex),
          line.slice(separatorIndex + 1),
        ];
      }),
  );
}

export function getSupabaseSchemaEnv(env = loadEnvFile()) {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "Missing SUPABASE_URL. Add it to .env before syncing the schema.",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Schema sync requires the service role key.",
    );
  }

  if (serviceRoleKey.startsWith("eeyJ")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY looks invalid (starts with \"eeyJ\"). Remove the extra \"e\" at the beginning.",
    );
  }

  return { url, serviceRoleKey };
}
