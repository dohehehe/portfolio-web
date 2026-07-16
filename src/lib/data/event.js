import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EVENT_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,date,space_ko,space_en";

export async function getNavigationEventListData() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event")
    .select(EVENT_LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
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
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event")
    .select("id,title_ko,title_en,date,space_ko,space_en,credit_ko,credit_en,gallery,file_link")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
    date: data.date,
    space: pickLocalized(data, "space", locale),
    credit: pickLocalized(data, "credit", locale),
    gallery: data.gallery,
    file_link: data.file_link,
  };
}
