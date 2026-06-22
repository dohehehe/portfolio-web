import { databaseSchema, tableNames } from "./generated/database.schema.js";

export { databaseSchema, tableNames };

export function getDatabaseSchema() {
  return databaseSchema;
}

export function getTableNames() {
  return [...tableNames];
}

export function getTable(tableName) {
  return databaseSchema.tables.find((table) => table.name === tableName) ?? null;
}

export function getTableColumns(tableName) {
  const table = getTable(tableName);

  if (!table) {
    return null;
  }

  return table.columns.map((column) => ({ ...column }));
}

export function getColumn(tableName, columnName) {
  const table = getTable(tableName);

  if (!table) {
    return null;
  }

  return (
    table.columns.find((column) => column.name === columnName) ?? null
  );
}

export function getColumnType(tableName, columnName) {
  const column = getColumn(tableName, columnName);

  if (!column) {
    return null;
  }

  if (column.format) {
    return column.format;
  }

  return column.type;
}

export function hasTable(tableName) {
  return tableNames.includes(tableName);
}
