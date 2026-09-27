import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import {
  getProjectColumns,
  getProjectRelatedColumns,
} from "@/lib/data/localizedSelect";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { isPubliclyVisible } from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fetchProjectRecordById = createCachedQuery(
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("project")
      .select(getProjectColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["project-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.project],
  },
);

const fetchProjectRelatedById = createCachedQuery(
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("project")
      .select(getProjectRelatedColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["project-related-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.project],
  },
);

export async function getProjectById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchProjectRecordById(id, locale);

  if (!data || !isPubliclyVisible(data)) {
    return null;
  }

  return data;
}

export async function getProjectRelatedById(id, locale = DEFAULT_LOCALE) {
  return fetchProjectRelatedById(id, locale);
}
