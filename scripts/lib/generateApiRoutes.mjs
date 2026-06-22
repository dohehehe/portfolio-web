import fs from "fs";
import path from "path";

function buildCollectionRoute(table) {
  return `import { createCollectionHandlers } from "@/lib/api/crud";

export const { GET, POST } = createCollectionHandlers("${table}");
`;
}

function buildItemRoute(table) {
  return `import { createItemHandlers } from "@/lib/api/crud";

export const { GET, PATCH, DELETE } = createItemHandlers("${table}");
`;
}

export function generateApiRoutes(tables, apiDir) {
  fs.mkdirSync(apiDir, { recursive: true });

  const tableNames = tables.map((table) => table.name).sort();
  const nextTables = new Set(tableNames);

  for (const table of tableNames) {
    const collectionDir = path.join(apiDir, table);
    const itemDir = path.join(apiDir, table, "[id]");

    fs.mkdirSync(itemDir, { recursive: true });
    fs.writeFileSync(
      path.join(collectionDir, "route.js"),
      buildCollectionRoute(table),
    );
    fs.writeFileSync(path.join(itemDir, "route.js"), buildItemRoute(table));
  }

  if (fs.existsSync(apiDir)) {
    for (const entry of fs.readdirSync(apiDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith("[")) {
        continue;
      }

      if (!nextTables.has(entry.name)) {
        fs.rmSync(path.join(apiDir, entry.name), {
          recursive: true,
          force: true,
        });
      }
    }
  }

  return tableNames;
}
