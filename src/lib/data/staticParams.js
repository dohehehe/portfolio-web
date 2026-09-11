import "server-only";

import { getNavigationEventListData } from "@/lib/data/event";
import { getNavigationWorkListData } from "@/lib/data/navigationWorkList";
import { getNavigationTextListData } from "@/lib/data/text";
import { LOCALES } from "@/lib/locale/constants";

function buildLocalizedIdParams(ids) {
  const uniqueIds = [...new Set(ids)];

  return LOCALES.flatMap((locale) =>
    uniqueIds.map((id) => ({ locale, id })),
  );
}

export async function generateEventDetailStaticParams() {
  const events = await getNavigationEventListData();
  return buildLocalizedIdParams(events.map((event) => event.id));
}

export async function generateTextDetailStaticParams() {
  const texts = await getNavigationTextListData();
  return buildLocalizedIdParams(texts.map((text) => text.id));
}

export async function generateWorkDetailStaticParams() {
  const { projects, works } = await getNavigationWorkListData();
  return buildLocalizedIdParams([
    ...projects.map((project) => project.id),
    ...works.map((work) => work.id),
  ]);
}
