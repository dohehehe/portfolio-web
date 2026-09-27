import "server-only";

import { sortByYearDesc } from "@/components/navigation/workListUtils";
import {
  getTextDetailColumns,
  serializeWorkIds,
  TEXT_COLUMNS,
} from "@/lib/data/localizedSelect";
import { getEventRelatedById } from "@/lib/data/event";
import { getProjectRelatedById } from "@/lib/data/project";
import { getWorkRelatedById } from "@/lib/data/work";
import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import {
  applyPublicActiveFilter,
  isPubliclyVisible,
} from "@/lib/data/publicVisibility";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { normalizeRecord } from "@/lib/locale/normalizeRecord";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { localizedPath } from "@/lib/locale/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeTextType(record, locale) {
  const row = record?.text_type;

  if (!row) {
    return null;
  }

  const nameKo = row.name?.trim() || null;
  const nameEn = row.slug?.trim() || null;

  return {
    id: row.id,
    name: locale === "en" ? nameEn || nameKo : nameKo || nameEn,
    slug: row.slug ?? null,
  };
}

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
    type_id: record.type_id ?? null,
    type: normalizeTextType(record, locale),
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
    let query = supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .order("created_at", { ascending: false });

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

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
  async (id, locale) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("text")
      .select(getTextDetailColumns(locale))
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  {
    key: ["text-by-id-ko-fallback"],
    tags: [DATA_CACHE_TAG.text],
  },
);

const fetchTextsByWorkId = createCachedQuery(
  async (workId) => {
    const supabase = createSupabaseServerClient();
    let query = supabase.from("text").select(TEXT_COLUMNS).eq("work_id", workId);

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

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
    let query = supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .eq("project_id", projectId);

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

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
    let query = supabase
      .from("text")
      .select(TEXT_COLUMNS)
      .eq("event_id", eventId);

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

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

const fetchTextsByProjectAndWorkIds = createCachedQuery(
  async (projectId, workIdsKey) => {
    const supabase = createSupabaseServerClient();
    const workIds = workIdsKey ? workIdsKey.split(",") : [];
    let query = supabase.from("text").select(TEXT_COLUMNS);

    if (workIds.length > 0) {
      query = query.or(
        `project_id.eq.${projectId},work_id.in.(${workIds.join(",")})`,
      );
    } else {
      query = query.eq("project_id", projectId);
    }

    query = applyPublicActiveFilter(query);

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data ?? [];
  },
  {
    key: ["texts-by-project-and-work-ids"],
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
  const data = await fetchTextRecordById(id, locale);

  if (!data || !isPubliclyVisible(data)) {
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

function groupTextsByProjectAndWorks(records, projectId, workIds, locale) {
  const workIdSet = new Set(workIds);
  const projectTexts = [];
  const byWorkId = new Map(workIds.map((workId) => [workId, []]));

  for (const record of records) {
    const normalized = normalizeTextRecord(record, locale);

    if (record.project_id === projectId) {
      projectTexts.push(normalized);
    }

    if (record.work_id && workIdSet.has(record.work_id)) {
      byWorkId.get(record.work_id).push(normalized);
    }
  }

  return {
    projectTexts: sortByYearDesc(projectTexts),
    byWorkId: new Map(
      [...byWorkId.entries()].map(([workId, texts]) => [
        workId,
        sortByYearDesc(texts),
      ]),
    ),
  };
}

export async function getTextsGroupedByProjectAndWorks(
  projectId,
  workIds,
  locale = DEFAULT_LOCALE,
) {
  const records = await fetchTextsByProjectAndWorkIds(
    projectId,
    serializeWorkIds(workIds),
  );

  return groupTextsByProjectAndWorks(records, projectId, workIds, locale);
}

export async function getRelatedItemsByText(text, locale = DEFAULT_LOCALE) {
  if (!text) {
    return [];
  }

  const [event, projectRecord, workRecord] = await Promise.all([
    text.event_id ? getEventRelatedById(text.event_id, locale) : null,
    text.project_id ? getProjectRelatedById(text.project_id, locale) : null,
    text.work_id ? getWorkRelatedById(text.work_id, locale) : null,
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
