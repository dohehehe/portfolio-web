import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LIVE_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,space_ko,space_en,start_at,end_at,link_url";

function getTodayDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isOngoing(startAt, endAt, today) {
  if (!startAt || !endAt) {
    return false;
  }

  return startAt <= today && today <= endAt;
}

function mapLiveRecord(record, locale, today = null) {
  return {
    id: record.id,
    createdAt: record.created_at,
    title: pickLocalized(record, "title", locale),
    space: pickLocalized(record, "space", locale),
    startAt: record.start_at,
    endAt: record.end_at,
    linkUrl: record.link_url,
    ...(today
      ? { isOngoing: isOngoing(record.start_at, record.end_at, today) }
      : {}),
  };
}

export async function getLives(locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const today = getTodayDateString();
  const { data, error } = await supabase
    .from("live")
    .select(LIVE_LIST_COLUMNS)
    .gte("end_at", today)
    .order("start_at", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map((record) => mapLiveRecord(record, locale, today));
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
    ...mapLiveRecord(data, locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
  };
}
