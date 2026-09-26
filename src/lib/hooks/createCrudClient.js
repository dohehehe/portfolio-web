import {
  dedupeInflight,
  getCachedItem,
  getCachedList,
  invalidateTable,
  patchCachedItem,
  removeCachedItem,
  setCachedItem,
  setCachedList,
} from "@/lib/hooks/resourceStore";

function getApiBase(table) {
  return `/api/${table}`;
}

async function parseResponse(responsePromise) {
  const response = await responsePromise;
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}

function buildListUrl(apiBase, scope, filters) {
  const params = new URLSearchParams({ scope });

  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value != null && value !== "") {
      params.set(key, String(value));
    }
  }

  return `${apiBase}?${params}`;
}

export function createCrudClient(table) {
  const apiBase = getApiBase(table);

  return {
    table,

    async fetchList({ scope = "list", force = false, filters = {} } = {}) {
      if (!force) {
        const cached = getCachedList(table, scope, filters);

        if (cached) {
          return cached;
        }
      }

      const url = buildListUrl(apiBase, scope, filters);
      const inflightKey = `list:${table}:${url}`;

      return dedupeInflight(inflightKey, async () => {
        const data = await parseResponse(fetch(url));
        setCachedList(table, scope, filters, data);
        return data;
      });
    },

    fetchOptions() {
      return this.fetchList({ scope: "options" });
    },

    async fetchOne(id, { force = false } = {}) {
      if (!id) {
        return null;
      }

      if (!force) {
        const cached = getCachedItem(table, id);

        if (cached) {
          return cached;
        }
      }

      const inflightKey = `item:${table}:${id}`;

      return dedupeInflight(inflightKey, async () => {
        const data = await parseResponse(fetch(`${apiBase}/${id}`));
        setCachedItem(table, id, data);
        return data;
      });
    },

    async create(payload) {
      const data = await parseResponse(
        fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      invalidateTable(table);

      if (data?.id) {
        setCachedItem(table, data.id, data);
      }

      return data;
    },

    async update(id, payload) {
      const data = await parseResponse(
        fetch(`${apiBase}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      if (data?.id) {
        setCachedItem(table, id, data);
        patchCachedItem(table, id, data);
      } else {
        invalidateTable(table);
      }

      return data;
    },

    async remove(id) {
      const data = await parseResponse(
        fetch(`${apiBase}/${id}`, {
          method: "DELETE",
        }),
      );

      removeCachedItem(table, id);
      return data;
    },

    invalidateCache() {
      invalidateTable(table);
    },
  };
}
