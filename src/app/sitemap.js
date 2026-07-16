import { buildSitemapEntries } from "@/lib/sitemap/entries";

export default async function sitemap() {
  return buildSitemapEntries();
}
