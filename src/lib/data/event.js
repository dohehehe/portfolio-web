import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EVENT_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,date,space_ko,space_en";

function normalizeEventListRecord(record, locale) {
  return {
    id: record.id,
    title: pickLocalized(record, "title", locale),
    date: record.date,
    space: pickLocalized(record, "space", locale),
  };
}

export async function getEvents(locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event")
    .select(EVENT_LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map((record) => normalizeEventListRecord(record, locale));
}

export async function getEventById(id, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event")
    .select("id,title_ko,title_en,date,space_ko,space_en")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    id: data.id,
    title: pickLocalized(data, "title", locale),
    date: data.date,
    space: pickLocalized(data, "space", locale),
  };
}
