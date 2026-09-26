function listCacheKey(table, scope, filters) {
  const filterKey =
    filters && Object.keys(filters).length > 0
      ? JSON.stringify(filters)
      : "";

  return `${table}:${scope}:${filterKey}`;
}

const listCache = new Map();
const itemCache = new Map();
const inflight = new Map();

export function getCachedList(table, scope, filters) {
  return listCache.get(listCacheKey(table, scope, filters));
}

export function setCachedList(table, scope, filters, data) {
  listCache.set(listCacheKey(table, scope, filters), data);
}

export function getCachedItem(table, id) {
  return itemCache.get(`${table}:${id}`);
}

export function setCachedItem(table, id, data) {
  itemCache.set(`${table}:${id}`, data);
}

export function invalidateTable(table) {
  for (const key of listCache.keys()) {
    if (key.startsWith(`${table}:`)) {
      listCache.delete(key);
    }
  }

  for (const key of itemCache.keys()) {
    if (key.startsWith(`${table}:`)) {
      itemCache.delete(key);
    }
  }
}

export function patchCachedItem(table, id, patch) {
  const cacheKey = `${table}:${id}`;
  const current = itemCache.get(cacheKey);

  if (current) {
    itemCache.set(cacheKey, { ...current, ...patch });
  }

  for (const [key, list] of listCache.entries()) {
    if (!key.startsWith(`${table}:`) || !Array.isArray(list)) {
      continue;
    }

    const index = list.findIndex((item) => item.id === id);

    if (index >= 0) {
      list[index] = { ...list[index], ...patch };
    }
  }
}

export function removeCachedItem(table, id) {
  itemCache.delete(`${table}:${id}`);

  for (const [key, list] of listCache.entries()) {
    if (!key.startsWith(`${table}:`) || !Array.isArray(list)) {
      continue;
    }

    listCache.set(
      key,
      list.filter((item) => item.id !== id),
    );
  }
}

export async function dedupeInflight(key, fetcher) {
  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = fetcher().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise;
}
