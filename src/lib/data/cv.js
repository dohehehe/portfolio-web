import { sortByYearDesc } from "@/components/navigation/workListUtils";
import { CV_LINK_SELECT, EVENT_WORK_LINK_SELECT } from "@/lib/data/localizedSelect";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CV_COLUMNS = `
  id,
  created_at,
  year,
  title_ko,
  title_en,
  space_ko,
  space_en,
  link_url,
  exhibition_id,
  type_id,
  cv_type:type_id (
    id,
    name_ko,
    name_en
  ),
  event:exhibition_id (
    id,
    title_ko,
    title_en,
    date,
    space_ko,
    space_en
  )
`;

const CV_TYPE_COLUMNS = "id,created_at,name_ko,name_en";

function getTypeHaystack(type) {
  return [type?.nameKo ?? type?.name_ko, type?.nameEn ?? type?.name_en]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getExhibitionKind(type) {
  const haystack = getTypeHaystack(type);

  if (haystack.includes("개인전") || /\bsolo\b/.test(haystack)) {
    return "solo";
  }

  if (haystack.includes("단체전") || /\bgroup\b/.test(haystack)) {
    return "group";
  }

  return null;
}

function isPerformanceOrScreeningType(type) {
  const haystack = getTypeHaystack(type);

  return (
    haystack.includes("퍼포먼스") ||
    haystack.includes("상영") ||
    /\bperformance\b/.test(haystack) ||
    /\bscreening\b/.test(haystack)
  );
}

function isWorkshopOrTeachingType(type) {
  const haystack = getTypeHaystack(type);

  return (
    haystack.includes("워크숍") ||
    haystack.includes("워크샵") ||
    haystack.includes("강의") ||
    /\bworkshop\b/.test(haystack) ||
    /\bteaching\b/.test(haystack)
  );
}

function shouldEmphasizeCvTitle(type) {
  return Boolean(getExhibitionKind(type) || isPerformanceOrScreeningType(type));
}

function normalizeExternalUrl(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeCvRecord(record, locale) {
  const event = record.event;
  const type = record.cv_type
    ? {
      id: record.cv_type.id,
      nameKo: record.cv_type.name_ko ?? null,
      nameEn: record.cv_type.name_en ?? null,
    }
    : null;

  return {
    id: record.id,
    typeId: record.type_id ?? null,
    eventId: record.exhibition_id ?? event?.id ?? null,
    linkUrl: normalizeExternalUrl(record.link_url),
    year: record.year,
    title:
      pickLocalized(record, "title", locale) ||
      (event ? pickLocalized(event, "title", locale) : null),
    space:
      pickLocalized(record, "space", locale) ||
      (event ? pickLocalized(event, "space", locale) : null),
    date: event?.date ?? null,
    created_at: record.created_at,
    emphasizeTitle: shouldEmphasizeCvTitle(type),
  };
}

function normalizeCvTypeRecord(record, locale) {
  return {
    id: record.id,
    name: pickLocalized(record, "name", locale),
    nameKo: record.name_ko ?? null,
    nameEn: record.name_en ?? null,
    created_at: record.created_at,
  };
}

const EXHIBITION_GROUP_ID = "__exhibition__";
const PERFORMANCE_SCREENING_GROUP_ID = "__performance_screening__";
const WORKSHOP_TEACHING_GROUP_ID = "__workshop_teaching__";

function getExhibitionSuffix(kind, locale) {
  if (kind === "solo") {
    return locale === "en" ? "(solo)" : "(개인)";
  }

  if (kind === "group") {
    return locale === "en" ? "(group)" : "(단체)";
  }

  return null;
}

function collectMergedItems(types, byTypeId, matcher) {
  const typeIds = [];
  const items = [];

  for (const type of types) {
    if (!matcher(type)) {
      continue;
    }

    typeIds.push(type.id);
    items.push(...(byTypeId.get(type.id) ?? []));
  }

  return { typeIds, items: sortByYearDesc(items) };
}

function buildMergedGroups(types, byTypeId, locale) {
  const mergedTypeIds = new Set();
  const mergeSlots = new Map();

  const exhibitionItems = [];
  const exhibitionTypeIds = [];

  for (const type of types) {
    const kind = getExhibitionKind(type);

    if (!kind) {
      continue;
    }

    exhibitionTypeIds.push(type.id);
    mergedTypeIds.add(type.id);

    for (const item of byTypeId.get(type.id) ?? []) {
      exhibitionItems.push({
        ...item,
        suffix: getExhibitionSuffix(kind, locale),
      });
    }
  }

  if (exhibitionItems.length > 0) {
    mergeSlots.set(EXHIBITION_GROUP_ID, {
      id: EXHIBITION_GROUP_ID,
      name: locale === "en" ? "Exhibition" : "전시",
      items: sortByYearDesc(exhibitionItems),
      typeIds: new Set(exhibitionTypeIds),
    });
  }

  const performanceMatcher = (type) =>
    isPerformanceOrScreeningType(type) && !getExhibitionKind(type);
  const performance = collectMergedItems(types, byTypeId, performanceMatcher);

  if (performance.items.length > 0) {
    for (const typeId of performance.typeIds) {
      mergedTypeIds.add(typeId);
    }

    mergeSlots.set(PERFORMANCE_SCREENING_GROUP_ID, {
      id: PERFORMANCE_SCREENING_GROUP_ID,
      name: locale === "en" ? "Performance / Screening" : "퍼포먼스 · 상영",
      items: performance.items,
      typeIds: new Set(performance.typeIds),
    });
  }

  const workshopMatcher = (type) =>
    isWorkshopOrTeachingType(type) &&
    !getExhibitionKind(type) &&
    !isPerformanceOrScreeningType(type);
  const workshop = collectMergedItems(types, byTypeId, workshopMatcher);

  if (workshop.items.length > 0) {
    for (const typeId of workshop.typeIds) {
      mergedTypeIds.add(typeId);
    }

    mergeSlots.set(WORKSHOP_TEACHING_GROUP_ID, {
      id: WORKSHOP_TEACHING_GROUP_ID,
      name: locale === "en" ? "workshop / teaching" : "워크숍·강의",
      items: workshop.items,
      typeIds: new Set(workshop.typeIds),
    });
  }

  return { mergedTypeIds, mergeSlots };
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

export async function getCvsGroupedByType(locale = DEFAULT_LOCALE) {
  const supabase = createSupabaseServerClient();
  const [typesResult, cvsResult] = await Promise.all([
    supabase
      .from("cv_type")
      .select(CV_TYPE_COLUMNS)
      .order("created_at", { ascending: true }),
    supabase.from("cv").select(CV_COLUMNS),
  ]);

  if (typesResult.error || cvsResult.error) {
    return [];
  }

  const types = (typesResult.data ?? []).map((type) =>
    normalizeCvTypeRecord(type, locale),
  );
  const cvs = sortByYearDesc(
    (cvsResult.data ?? []).map((cv) => normalizeCvRecord(cv, locale)),
  );

  const byTypeId = new Map();

  for (const cv of cvs) {
    const key = cv.typeId ?? "__none__";

    if (!byTypeId.has(key)) {
      byTypeId.set(key, []);
    }

    byTypeId.get(key).push(cv);
  }

  const { mergedTypeIds, mergeSlots } = buildMergedGroups(
    types,
    byTypeId,
    locale,
  );
  const insertedMergeIds = new Set();
  const groups = [];

  for (const type of types) {
    if (mergedTypeIds.has(type.id)) {
      for (const slot of mergeSlots.values()) {
        if (!slot.typeIds.has(type.id) || insertedMergeIds.has(slot.id)) {
          continue;
        }

        groups.push({
          id: slot.id,
          name: slot.name,
          items: slot.items,
        });
        insertedMergeIds.add(slot.id);
      }

      continue;
    }

    const items = byTypeId.get(type.id) ?? [];

    if (items.length === 0) {
      continue;
    }

    groups.push({
      id: type.id,
      name: type.name,
      items,
    });
  }

  const uncategorized = byTypeId.get("__none__") ?? [];

  if (uncategorized.length > 0) {
    groups.push({
      id: "__none__",
      name: locale === "en" ? "Other" : "기타",
      items: uncategorized,
    });
  }

  return groups;
}
