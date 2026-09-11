import "server-only";

import { sortWorksByOrder } from "@/components/navigation/workListUtils";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const WORK_ALL_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,medium_ko,medium_en,dimension_ko,dimension_en,content_ko,content_en,credit_ko,credit_en,gallery,"order"';

const fetchWorksByProjectId = createCachedQuery(
  async (projectId) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work")
      .select(WORK_ALL_COLUMNS)
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
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("work")
      .select(WORK_ALL_COLUMNS)
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

export async function getWorksByProjectId(projectId, _locale = DEFAULT_LOCALE) {
  return fetchWorksByProjectId(projectId);
}

export async function getWorkById(id, _locale = DEFAULT_LOCALE) {
  return fetchWorkRecordById(id);
}
