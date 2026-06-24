import { tableNames } from "@/lib/supabase/generated/database.schema";

const TABLE_SET = new Set(tableNames);

export function isValidTable(table) {
  return TABLE_SET.has(table);
}

export function assertValidTable(table) {
  if (!isValidTable(table)) {
    throw new Error(`Unknown table: ${table}`);
  }

  return table;
}

export function getApiResources() {
  return [...tableNames];
}
