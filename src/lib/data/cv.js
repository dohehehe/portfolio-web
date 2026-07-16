import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { CV_LINK_SELECT, EVENT_WORK_LINK_SELECT } from "@/lib/data/localizedSelect";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeCvRecord(record, locale) {
  const event = record.event;
  const eventTitle =
    pickLocalized(record, "event_title", locale) ||
    (event ? pickLocalized(event, "title", locale) : null);

  return {
    id: record.id,
    eventId: record.exhibition_id ?? event?.id ?? null,
    year: record.year,
    title: pickLocalized(record, "title", locale),
    eventTitle,
    date: event?.date ?? null,
    space: event ? pickLocalized(event, "space", locale) : null,
  };
}

function normalizeLinkedWorkRecord(record, type, locale) {
  return {
    id: record.id,
    type,
    projectId: type === "work" ? record.project_id : record.id,
    year: record.year,
    title: pickLocalized(record, "title", locale),
    medium: pickLocalized(record, "medium", locale),
    dimension: pickLocalized(record, "dimension", locale),
    created_at: record.created_at,
  };
}

export async function getCvsByWorkId(workId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("link_cv_item")
    .select(CV_LINK_SELECT)
    .eq("work_id", workId);

  if (error) {
    return [];
  }

  const seen = new Set();
  const cvs = [];

  for (const link of data ?? []) {
    if (!link.cv || seen.has(link.cv.id)) {
      continue;
    }

    seen.add(link.cv.id);
    cvs.push(normalizeCvRecord(link.cv, locale));
  }

  return sortByYearDesc(cvs);
}

export async function getCvsByProjectId(projectId, locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("link_cv_item")
    .select(CV_LINK_SELECT)
    .eq("project_id", projectId);

  if (error) {
    return [];
  }

  const seen = new Set();
  const cvs = [];

  for (const link of data ?? []) {
    if (!link.cv || seen.has(link.cv.id)) {
      continue;
    }

    seen.add(link.cv.id);
    cvs.push(normalizeCvRecord(link.cv, locale));
  }

  return sortByYearDesc(cvs);
}

export async function getProjectsAndWorksByEventId(
  eventId,
  locale = DEFAULT_LOCALE,
) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("link_cv_item")
    .select(EVENT_WORK_LINK_SELECT)
    .eq("cv.exhibition_id", eventId);

  if (error) {
    return [];
  }

  const seen = new Set();
  const items = [];

  for (const link of data ?? []) {
    if (link.project && !seen.has(`project:${link.project.id}`)) {
      seen.add(`project:${link.project.id}`);
      items.push(normalizeLinkedWorkRecord(link.project, "project", locale));
    }

    if (link.work && !seen.has(`work:${link.work.id}`)) {
      seen.add(`work:${link.work.id}`);
      items.push(normalizeLinkedWorkRecord(link.work, "work", locale));
    }
  }

  return sortByYearDesc(items);
}
