import "server-only";

import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { TEXT_COLUMNS, TEXT_DETAIL_COLUMNS } from "@/lib/data/localizedSelect";
import { getEventById } from "@/lib/data/event";
import { getProjectById } from "@/lib/data/project";
import { getWorkById } from "@/lib/data/work";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { normalizeRecord } from "@/lib/locale/normalizeRecord";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { localizedPath } from "@/lib/locale/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeTextRecord(record, locale) {
  return {
    id: record.id,
    created_at: record.created_at,
    year: record.year,
    title: pickLocalized(record, "title", locale),
    titleKo: pickLocalized(record, "title", "ko"),
    titleEn: pickLocalized(record, "title", "en"),
    writer: pickLocalized(record, "writer", locale),
    content: pickLocalized(record, "content", locale),
    project_id: record.project_id ?? null,
    event_id: record.event_id ?? null,
    work_id: record.work_id ?? null,
  };
}

function extractYear(dateString) {
  const match = dateString?.match(/\d{4}/);
  return match?.[0] ?? null;
}

function formatWorkMeta({ year, medium, dimension }) {
  const rest = [medium, dimension].filter(Boolean).join(" ");

  if (year) {
    return rest ? `${year}. ${rest}` : `${year}.`;
  }

  return rest;
}

const fetchNavigationTextListData = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return sortByYearDesc(data ?? []);
  },
  {
    key: ["navigation-text-list"],
    tags: [DATA_CACHE_TAG.text, DATA_CACHE_TAG.navigation],
  },
);

const fetchTextRecordById = createCachedQuery(
  async (id) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(TEXT_DETAIL_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["text-by-id"],
    tags: [DATA_CACHE_TAG.text],
  },
);

const fetchTextsByWorkId = createCachedQuery(
  async (workId) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .eq("work_id", workId);

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["texts-by-work-id"],
    tags: [DATA_CACHE_TAG.text],
  },
);

const fetchTextsByProjectId = createCachedQuery(
  async (projectId) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .eq("project_id", projectId);

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["texts-by-project-id"],
    tags: [DATA_CACHE_TAG.text],
  },
);

const fetchTextsByEventId = createCachedQuery(
  async (eventId) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .eq("event_id", eventId);

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["texts-by-event-id"],
    tags: [DATA_CACHE_TAG.text],
  },
);

export async function getNavigationTextListData() {
  return fetchNavigationTextListData();
}

export async function getTexts(locale = DEFAULT_LOCALE) {
  const records = await getNavigationTextListData();

  return records.map((record) => normalizeTextRecord(record, locale));
}

export async function getTextById(id, locale = DEFAULT_LOCALE) {
  const data = await fetchTextRecordById(id);

  if (!data) {
    return null;
  }

  return normalizeTextRecord(data, locale);
}

export async function getTextsByWorkId(workId, locale = DEFAULT_LOCALE) {
  const records = await fetchTextsByWorkId(workId);

  return sortByYearDesc(
    records.map((record) => normalizeTextRecord(record, locale)),
  );
}

export async function getTextsByProjectId(projectId, locale = DEFAULT_LOCALE) {
  const records = await fetchTextsByProjectId(projectId);

  return sortByYearDesc(
    records.map((record) => normalizeTextRecord(record, locale)),
  );
}

export async function getTextsByEventId(eventId, locale = DEFAULT_LOCALE) {
  const records = await fetchTextsByEventId(eventId);

  return sortByYearDesc(
    records.map((record) => normalizeTextRecord(record, locale)),
  );
}

export async function getRelatedItemsByText(text, locale = DEFAULT_LOCALE) {
  if (!text) {
    return [];
  }

  const [event, projectRecord, workRecord] = await Promise.all([
    text.event_id ? getEventById(text.event_id, locale) : null,
    text.project_id ? getProjectById(text.project_id, locale) : null,
    text.work_id ? getWorkById(text.work_id, locale) : null,
  ]);

  const related = [];

  if (event) {
    related.push({
      type: "event",
      id: event.id,
      title: event.title,
      meta: [extractYear(event.date), event.space].filter(Boolean).join(", "),
      href: localizedPath(`/event/${event.id}`, locale),
    });
  }

  if (projectRecord) {
    const project = normalizeRecord(projectRecord, locale);
    related.push({
      type: "project",
      id: project.id,
      title: project.title,
      meta: formatWorkMeta(project),
      href: localizedPath(`/work/${project.id}`, locale),
    });
  }

  if (workRecord) {
    const work = normalizeRecord(workRecord, locale);
    related.push({
      type: "work",
      id: work.id,
      title: work.title,
      meta: formatWorkMeta(work),
      href: work.project_id
        ? localizedPath(`/work/${work.project_id}`, locale, work.id)
        : localizedPath(`/work/${work.id}`, locale),
    });
  }

  return related;
}
