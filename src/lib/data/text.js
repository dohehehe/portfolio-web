import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { TEXT_COLUMNS } from "@/lib/data/localizedSelect";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeTextRecord(record, locale) {
  return {
    id: record.id,
    created_at: record.created_at,
    year: record.year,
    title: pickLocalized(record, "title", locale),
    writer: pickLocalized(record, "writer", locale),
  };
}

export async function getTextsByWorkId(workId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("text")
    .select(TEXT_COLUMNS)
    .eq("work_id", workId);

  if (error) {
    return [];
  }

  return sortByYearDesc(
    (data ?? []).map((record) => normalizeTextRecord(record, locale)),
  );
}

export async function getTextsByProjectId(projectId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("text")
    .select(TEXT_COLUMNS)
    .eq("project_id", projectId);

  if (error) {
    return [];
  }

  return sortByYearDesc(
    (data ?? []).map((record) => normalizeTextRecord(record, locale)),
  );
}

export async function getTextsByEventId(eventId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("text")
    .select(TEXT_COLUMNS)
    .eq("event_id", eventId);

  if (error) {
    return [];
  }

  return sortByYearDesc(
    (data ?? []).map((record) => normalizeTextRecord(record, locale)),
  );
}
