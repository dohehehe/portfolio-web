import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { DATA_CACHE_TAG } from "@/lib/data/cache";
import { LOCALES } from "@/lib/locale/constants";
import { localizedPath } from "@/lib/locale/routing";

const NAV_DATA_TABLES = new Set(["event", "text", "work", "project"]);

const RELATED_TAGS = {
  link_cv_item: [
    DATA_CACHE_TAG.cv,
    DATA_CACHE_TAG.project,
    DATA_CACHE_TAG.work,
    DATA_CACHE_TAG.event,
  ],
  cv: [DATA_CACHE_TAG.cv_type],
  text_type: [DATA_CACHE_TAG.text],
};

const TABLE_DETAIL_PATH = {
  event: (id) => `/event/${id}`,
  text: (id) => `/text/${id}`,
  project: (id) => `/work/${id}`,
  work: (id) => `/work/${id}`,
};

const TABLE_LIST_PATHS = {
  event: ["/event"],
  text: ["/text"],
  project: ["/work", "/"],
  work: ["/work", "/"],
  info: ["/info"],
  live: ["/"],
  cv: ["/info"],
  cv_type: ["/info"],
};

function revalidatePathForAllLocales(pathname) {
  for (const locale of LOCALES) {
    revalidatePath(localizedPath(pathname, locale));
  }
}

function revalidateDetailPath(table, id) {
  const buildPath = TABLE_DETAIL_PATH[table];

  if (!buildPath || !id) {
    return;
  }

  revalidatePathForAllLocales(buildPath(id));
}

function revalidateListPaths(table) {
  const paths = TABLE_LIST_PATHS[table] ?? [];

  for (const pathname of paths) {
    revalidatePathForAllLocales(pathname);
  }
}

function revalidateRelatedDetailPaths(table, record) {
  if (table === "work" && record?.project_id) {
    revalidateDetailPath("project", record.project_id);
  }
}

export function revalidateDataCache(table, { id, record } = {}) {
  const tag = DATA_CACHE_TAG[table] ?? `data:${table}`;
  revalidateTag(tag);

  if (NAV_DATA_TABLES.has(table)) {
    revalidateTag(DATA_CACHE_TAG.navigation);
  }

  for (const relatedTag of RELATED_TAGS[table] ?? []) {
    revalidateTag(relatedTag);
  }

  revalidateDetailPath(table, id ?? record?.id);
  revalidateRelatedDetailPaths(table, record);
  revalidateListPaths(table);
}
