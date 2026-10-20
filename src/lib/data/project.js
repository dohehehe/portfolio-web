import "server-only";

import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import {
  getProjectColumns,
  getProjectRelatedColumns,
} from "@/lib/data/localizedSelect";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import {
  applyPublicActiveFilter,
  isPubliclyVisible,
} from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const HOME_GALLERY_COLUMNS =
  "id,created_at,year,title_ko,title_en,gallery,is_active";

const fetchProjectsForHomeGallery = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await applyPublicActiveFilter(
      supabase.from("project").select(HOME_GALLERY_COLUMNS),
    );

    if (error) {
      return [];
    }

    return sortByYearDesc(data ?? []);
  },
  {
    key: ["projects-for-home-gallery"],
    tags: [DATA_CACHE_TAG.project],
  },
);

export async function getProjectsForHomeGallery() {
  return fetchProjectsForHomeGallery();
}

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
