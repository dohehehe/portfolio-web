import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EVENT_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,date,space_ko,space_en";

const EVENT_DETAIL_COLUMNS =
  "id,title_ko,title_en,date,space_ko,space_en,credit_ko,credit_en,gallery,file_link,note_kr,note_en";

const fetchNavigationEventListData = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event")
      .select(EVENT_LIST_COLUMNS)
      .order("created_at", { ascending: false });

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
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event")
      .select(EVENT_DETAIL_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["event-by-id"],
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

export async function getEventById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchEventRecordById(id);

  if (!data) {
    return null;
  }

  const note = pickLocalized(
    { note_ko: data.note_kr, note_en: data.note_en },
    "note",
    locale,
  );

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
    date: data.date,
    space: pickLocalized(data, "space", locale),
    credit: pickLocalized(data, "credit", locale),
    note,
    gallery: data.gallery,
    file_link: data.file_link,
  };
}
