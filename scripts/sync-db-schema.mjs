import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { buildSchemaModuleSource, fetchDatabaseSchema } from "./lib/fetchSchema.mjs";
import { getSupabaseSchemaEnv } from "./lib/loadEnv.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.resolve(
  __dirname,
  "../src/lib/supabase/generated",
);

async function main() {
  const env = getSupabaseSchemaEnv();
  const schema = await fetchDatabaseSchema(env);

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const jsonPath = path.join(GENERATED_DIR, "database.schema.json");
  const jsPath = path.join(GENERATED_DIR, "database.schema.js");

  fs.writeFileSync(jsonPath, `${JSON.stringify(schema, null, 2)}\n`);
  fs.writeFileSync(jsPath, `${buildSchemaModuleSource(schema)}\n`);

  console.log(`Synced ${schema.tables.length} tables from ${env.url}`);
  console.log(`- ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`- ${path.relative(process.cwd(), jsPath)}`);

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
