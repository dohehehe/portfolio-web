import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LIVE_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,space_ko,space_en,start_at,end_at,link_url";

export async function getLives(locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("live")
    .select(LIVE_LIST_COLUMNS)
    .order("start_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map((record) => ({
    id: record.id,
    createdAt: record.created_at,
    title: pickLocalized(record, "title", locale),
    space: pickLocalized(record, "space", locale),
    startAt: record.start_at,
    endAt: record.end_at,
    linkUrl: record.link_url,
  }));
}

export async function getLiveById(id, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("live")
    .select(LIVE_LIST_COLUMNS)
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    id: data.id,
    createdAt: data.created_at,
    title: pickLocalized(data, "title", locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
    space: pickLocalized(data, "space", locale),
    startAt: data.start_at,
    endAt: data.end_at,
    linkUrl: data.link_url,
  };
}
