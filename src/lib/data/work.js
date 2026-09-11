import "server-only";

import { sortWorksByOrder } from "@/components/navigation/workListUtils";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import {
  getWorkColumns,
  getWorkRelatedColumns,
} from "@/lib/data/localizedSelect";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fetchWorksByProjectId = createCachedQuery(
  async (projectId, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work")
      .select(getWorkColumns(locale))
      .eq("project_id", projectId);

    if (error) {
      return [];
    }

    return sortWorksByOrder(data ?? []);
  },
  {
    key: ["works-by-project-id"],
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
    key: ["work-by-id"],
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
    key: ["work-related-by-id"],
    tags: [DATA_CACHE_TAG.work],
  },
);

export async function getWorksByProjectId(projectId, locale = DEFAULT_LOCALE) {
  return fetchWorksByProjectId(projectId, locale);
}

export async function getWorkById(id, locale = DEFAULT_LOCALE) {
  return fetchWorkRecordById(id, locale);
}

export async function getWorkRelatedById(id, locale = DEFAULT_LOCALE) {
  return fetchWorkRelatedById(id, locale);
}
