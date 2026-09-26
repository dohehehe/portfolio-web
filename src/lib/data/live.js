import "server-only";

import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import {
  applyPublicActiveFilter,
  isPubliclyVisible,
} from "@/lib/data/publicVisibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LIVE_LIST_COLUMNS =
  "id,created_at,title_ko,title_en,space_ko,space_en,start_at,end_at,link_url,is_active";

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

const fetchActiveLiveRecords = createCachedQuery(
  async (today) => {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("live")
      .select(LIVE_LIST_COLUMNS)
      .gte("end_at", today)
      .order("start_at", { ascending: true });

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["live-active"],
    tags: [DATA_CACHE_TAG.live],
  },
);

const fetchLiveRecordById = createCachedQuery(
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("live")
      .select(LIVE_LIST_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["live-by-id"],
    tags: [DATA_CACHE_TAG.live],
  },
);

export async function getLives(locale = DEFAULT_LOCALE) {
  const today = getTodayDateString();
  const records = await fetchActiveLiveRecords(today);

  return records.map((record) => mapLiveRecord(record, locale, today));
}

export async function getLiveById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchLiveRecordById(id);

  if (!data || !isPubliclyVisible(data)) {
    return null;
  }

  return {
    ...mapLiveRecord(data, locale),
    titleKo: pickLocalized(data, "title", "ko"),
    titleEn: pickLocalized(data, "title", "en"),
  };
}
