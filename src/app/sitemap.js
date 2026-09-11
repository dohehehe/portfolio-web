import { buildSitemapEntries } from "@/lib/sitemap/entries";

/** Keep in sync with DATA_REVALIDATE_SECONDS in @/lib/data/cache */
export const revalidate = 3600;

export default async function sitemap() {
  return buildSitemapEntries();
}
