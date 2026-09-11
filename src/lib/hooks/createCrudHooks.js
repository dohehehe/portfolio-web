"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function serializeFilters(filters) {
  return JSON.stringify(filters ?? {});
}

export function createCrudHooks(client) {
  function useList({ enabled = true, scope = "list", filters = {} } = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(null);
    const filtersKey = useMemo(() => serializeFilters(filters), [filters]);

    const refetch = useCallback(
      async ({ force = true } = {}) => {
        setLoading(true);
        setError(null);

        try {
          const items = await client.fetchList({
            scope,
            force,
            filters,
          });
          setData(items);
          return items;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [scope, filtersKey],
    );

    useEffect(() => {
      if (!enabled) {
        return;
      }

      let cancelled = false;

      async function loadItems() {
        setLoading(true);
        setError(null);

        try {
          const items = await client.fetchList({
            scope,
            force: false,
            filters,
          });

          if (!cancelled) {
            setData(items);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      loadItems();

      return () => {
        cancelled = true;
      };
    }, [enabled, scope, filtersKey]);

    return { data, loading, error, refetch };
  }

  function useItem(id, { enabled = true } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(enabled && id));
    const [error, setError] = useState(null);

    const refetch = useCallback(
      async ({ force = true } = {}) => {
        if (!id) {
          return null;
        }

        setLoading(true);
        setError(null);

        try {
          const item = await client.fetchOne(id, { force });
          setData(item);
          return item;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [id],
    );

    useEffect(() => {
      if (!enabled || !id) {
        return;
      }

      let cancelled = false;

      async function loadItem() {
        setLoading(true);
        setError(null);

        try {
          const item = await client.fetchOne(id, { force: false });

          if (!cancelled) {
            setData(item);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      loadItem();

      return () => {
        cancelled = true;
      };
    }, [enabled, id]);

    return { data, loading, error, refetch };
  }

  function useCreate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = useCallback(async (payload) => {
      setLoading(true);
      setError(null);

      try {
        return await client.create(payload);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    return { create, loading, error };
  }

  function useUpdate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = useCallback(async (id, payload) => {
      setLoading(true);
      setError(null);

      try {
        return await client.update(id, payload);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    return { update, loading, error };
  }

  function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = useCallback(async (id) => {
      setLoading(true);
      setError(null);

      try {
        return await client.remove(id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    return { remove, loading, error };
  }

  return {
    useList,
    useItem,
    useCreate,
    useUpdate,
    useDelete,
  };
}
