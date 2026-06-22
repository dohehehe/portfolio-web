function parseForeignKey(description = "") {
  const match = description.match(
    /Foreign Key to `([^`]+)\.([^`]+)`/,
  );

  if (!match) {
    return null;
  }

  return {
    table: match[1],
    column: match[2],
  };
}

function normalizeColumn(name, property, requiredColumns) {
  const openApiType = Array.isArray(property.type)
    ? property.type.filter((value) => value !== "null")[0] ?? "unknown"
    : property.type ?? "unknown";

  return {
    name,
    type: openApiType,
    format: property.format ?? null,
    nullable: Array.isArray(property.type)
      ? property.type.includes("null")
      : !requiredColumns.has(name),
    default: property.default ?? null,
    isPrimaryKey: property.description?.includes("<pk/>") ?? false,
    foreignKey: parseForeignKey(property.description),
  };
}

function normalizeTable(name, definition) {
  const requiredColumns = new Set(definition.required ?? []);
  const columns = Object.entries(definition.properties ?? {}).map(
    ([columnName, property]) =>
      normalizeColumn(columnName, property, requiredColumns),
  );

  return {
    name,
    columns,
  };
}

export async function fetchDatabaseSchema({ url, serviceRoleKey }) {
  const response = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/openapi+json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Failed to fetch Supabase schema (${response.status}): ${body}`,
    );
  }

  const openApiSchema = await response.json();
  const tables = Object.entries(openApiSchema.definitions ?? {})
    .map(([tableName, definition]) => normalizeTable(tableName, definition))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    syncedAt: new Date().toISOString(),
    supabaseUrl: url,
    tables,
  };
}

export function buildSchemaModuleSource(schema) {
  return `/**
 * AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
 * Run \`npm run db:sync\` after changing Supabase tables.
 *
 * Synced at: ${schema.syncedAt}
 * Source: ${schema.supabaseUrl}
 */

export const databaseSchema = ${JSON.stringify(schema, null, 2)};

export const tableNames = ${JSON.stringify(schema.tables.map((table) => table.name), null, 2)};
`;
}
