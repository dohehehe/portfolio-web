import "server-only";

import { sortWorksByOrder } from "@/components/navigation/workListUtils";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import {
  getWorkColumns,
  getWorkRelatedColumns,
} from "@/lib/data/localizedSelect";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import {
  applyPublicActiveFilter,
  isPubliclyVisible,
} from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fetchWorksByProjectId = createCachedQuery(
  async (projectId, locale) => {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("work")
      .select(getWorkColumns(locale))
      .eq("project_id", projectId);

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return sortWorksByOrder(data ?? []);
  },
  {
    key: ["works-by-project-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.work],
  },
);

const fetchWorkRecordById = createCachedQuery(
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work")
      .select(getWorkColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["work-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.work],
  },
);

const fetchWorkRelatedById = createCachedQuery(
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work")
      .select(getWorkRelatedColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["work-related-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.work],
  },
);

export async function getWorksByProjectId(projectId, locale = DEFAULT_LOCALE) {
  return fetchWorksByProjectId(projectId, locale);
}

export async function getWorkById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchWorkRecordById(id, locale);

  if (!data || !isPubliclyVisible(data)) {
    return null;
  }

  return data;
}

export async function getWorkRelatedById(id, locale = DEFAULT_LOCALE) {
  return fetchWorkRelatedById(id, locale);
}
