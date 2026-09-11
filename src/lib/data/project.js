import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PROJECT_ALL_COLUMNS =
  "id,created_at,year,title_ko,title_en,medium_ko,medium_en,dimension_ko,dimension_en,content_ko,content_en,credit_ko,credit_en,gallery";

const fetchProjectRecordById = createCachedQuery(
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("project")
      .select(PROJECT_ALL_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["project-by-id"],
    tags: [DATA_CACHE_TAG.project],
  },
);

export async function getProjectById(id, _locale = DEFAULT_LOCALE) {
  return fetchProjectRecordById(id);
}
