import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { buildSchemaModuleSource, fetchDatabaseSchema } from "./lib/fetchSchema.mjs";
import { generateApiRoutes } from "./lib/generateApiRoutes.mjs";
import { generateHookModules } from "./lib/generateHookModules.mjs";
import { getSupabaseSchemaEnv } from "./lib/loadEnv.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.resolve(
  __dirname,
  "../src/lib/supabase/generated",
);
const API_DIR = path.resolve(__dirname, "../src/app/api");
const HOOKS_DIR = path.resolve(__dirname, "../src/hooks");

async function main() {
  const env = getSupabaseSchemaEnv();
  const schema = await fetchDatabaseSchema(env);

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const jsonPath = path.join(GENERATED_DIR, "database.schema.json");
  const jsPath = path.join(GENERATED_DIR, "database.schema.js");

  fs.writeFileSync(jsonPath, `${JSON.stringify(schema, null, 2)}\n`);
  fs.writeFileSync(jsPath, `${buildSchemaModuleSource(schema)}\n`);

  const apiTables = generateApiRoutes(schema.tables, API_DIR);
  const hookTables = generateHookModules(schema.tables, HOOKS_DIR);

  console.log(`Synced ${schema.tables.length} tables from ${env.url}`);
  console.log(`- ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`- ${path.relative(process.cwd(), jsPath)}`);
  console.log(`- ${path.relative(process.cwd(), API_DIR)} (${apiTables.length} routes)`);
  console.log(`- ${path.relative(process.cwd(), HOOKS_DIR)} (${hookTables.length} modules)`);

  for (const table of schema.tables) {
    const columns = table.columns
      .map((column) => {
        const typeLabel = column.format ?? column.type;
        return `${column.name}: ${typeLabel}`;
      })
      .join(", ");

    console.log(`  • ${table.name} (${columns})`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
