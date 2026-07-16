import { getNavigationEventListData } from "@/lib/data/event";
import { getNavigationWorkListData } from "@/lib/data/navigationWorkList";
import { getNavigationTextListData } from "@/lib/data/text";
import { LOCALES } from "@/lib/locale/constants";
import { localizedPath } from "@/lib/locale/routing";
import { SITE_URL } from "@/lib/site/constants";

const STATIC_PATHS = ["/", "/work", "/text", "/event", "/info"];

function toSitemapEntry(pathname, locale, lastModified) {
  return {
    url: new URL(localizedPath(pathname, locale), SITE_URL).toString(),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
  };
}

function localizedEntries(pathname, lastModified) {
  return LOCALES.map((locale) => toSitemapEntry(pathname, locale, lastModified));
}

export async function buildSitemapEntries() {
  const [{ projects, works }, events, texts] = await Promise.all([
    getNavigationWorkListData(),
    getNavigationEventListData(),
    getNavigationTextListData(),
  ]);

  const entries = [];

  for (const path of STATIC_PATHS) {
    entries.push(...localizedEntries(path));
  }

  for (const project of projects) {
    entries.push(...localizedEntries(`/work/${project.id}`, project.created_at));
  }

  for (const work of works) {
    entries.push(...localizedEntries(`/work/${work.id}`, work.created_at));
  }

  for (const event of events) {
    entries.push(...localizedEntries(`/event/${event.id}`, event.created_at));
  }

  for (const text of texts) {
    entries.push(...localizedEntries(`/text/${text.id}`, text.created_at));
  }

  return entries;
}
