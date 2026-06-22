import fs from "fs";
import path from "path";

function snakeToPascal(value) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function buildHookModule(table) {
  const singular = snakeToPascal(table);
  const plural = `${singular}s`;

  return `"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("${table}");

export const fetch${plural} = client.fetchList;
export const fetch${singular} = client.fetchOne;
export const create${singular} = client.create;
export const update${singular} = client.update;
export const delete${singular} = client.remove;

export const use${plural} = hooks.useList;
export const use${singular} = hooks.useItem;
export const useCreate${singular} = hooks.useCreate;
export const useUpdate${singular} = hooks.useUpdate;
export const useDelete${singular} = hooks.useDelete;
`;
}

export function generateHookModules(tables, hooksDir) {
  fs.mkdirSync(hooksDir, { recursive: true });

  const tableNames = tables.map((table) => table.name).sort();
  const nextTables = new Set(tableNames);

  for (const table of tableNames) {
    const tableDir = path.join(hooksDir, table);
    fs.mkdirSync(tableDir, { recursive: true });
    fs.writeFileSync(path.join(tableDir, "index.js"), buildHookModule(table));
  }

  if (fs.existsSync(hooksDir)) {
    for (const entry of fs.readdirSync(hooksDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (!nextTables.has(entry.name)) {
        fs.rmSync(path.join(hooksDir, entry.name), {
          recursive: true,
          force: true,
        });
      }
    }
  }

  fs.writeFileSync(
    path.join(hooksDir, "index.js"),
    `${tableNames.map((table) => `export * from "@/hooks/${table}";`).join("\n")}\n`,
  );

  return tableNames;
}
