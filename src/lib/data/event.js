import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { getEventDetailColumns } from "@/lib/data/localizedSelect";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import {
  applyPublicActiveFilter,
  isPubliclyVisible,
} from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EVENT_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,date,space_ko,space_en,is_active";

const fetchNavigationEventListData = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("event")
      .select(EVENT_LIST_COLUMNS)
      .order("created_at", { ascending: false });

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["navigation-event-list"],
    tags: [DATA_CACHE_TAG.event, DATA_CACHE_TAG.navigation],
  },
);

const fetchEventRecordById = createCachedQuery(
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event")
      .select(getEventDetailColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["event-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.event],
  },
);

const fetchEventRelatedById = createCachedQuery(
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event")
      .select(EVENT_LIST_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["event-related-by-id"],
    tags: [DATA_CACHE_TAG.event],
  },
);

export async function getNavigationEventListData() {
  return fetchNavigationEventListData();
}

export async function getEvents(locale = DEFAULT_LOCALE) {
  const records = await getNavigationEventListData();

  return records.map((record) => ({
    id: record.id,
    title: pickLocalized(record, "title", locale),
    date: record.date,
    space: pickLocalized(record, "space", locale),
  }));
}

export async function getEventRelatedById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchEventRelatedById(id);

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    date: data.date,
    space: pickLocalized(data, "space", locale),
  };
}

export async function getEventById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchEventRecordById(id, locale);

  if (!data || !isPubliclyVisible(data)) {
    return null;
  }

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
    date: data.date,
    space: pickLocalized(data, "space", locale),
    content: pickLocalized(data, "content", locale),
    credit: pickLocalized(data, "credit", locale),
    gallery: data.gallery,
    file_link: data.file_link,
    linkUrl: data.link_url ?? null,
    isActive: data.is_active ?? null,
  };
}
