import { tableNames } from "@/lib/supabase/generated/database.schema";
import { createCrudClient } from "@/lib/hooks/createCrudClient";
import { createCrudHooks } from "@/lib/hooks/createCrudHooks";

function snakeToPascal(value) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function buildResourceExports(table) {
  const singular = snakeToPascal(table);
  const plural = `${singular}s`;
  const client = createCrudClient(table);
  const hooks = createCrudHooks(client);

  return {
    table,
    client,
    hooks,
    names: { singular, plural },
  };
}

const resourceMap = Object.fromEntries(
  tableNames.map((table) => [table, buildResourceExports(table)]),
);

export function getResource(table) {
  return resourceMap[table] ?? null;
}

export function getResources() {
  return resourceMap;
}

export { tableNames as resourceTables };
