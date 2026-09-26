import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

/** Cross-request cache TTL. Admin mutations invalidate via revalidateTag. */
export const DATA_REVALIDATE_SECONDS = 3600;

export const DATA_CACHE_TAG = {
  event: "data:event",
  text: "data:text",
  work: "data:work",
  project: "data:project",
  live: "data:live",
  info: "data:info",
  cv: "data:cv",
  cv_type: "data:cv_type",
  text_type: "data:text_type",
  link_cv_item: "data:link_cv_item",
  navigation: "data:navigation",
};

/**
 * Wraps a Supabase fetcher with:
 * - unstable_cache: reuse results across requests (ISR-style)
 * - React cache: dedupe calls within a single render pass
 */
export function createCachedQuery(fetcher, { key, tags, revalidate = DATA_REVALIDATE_SECONDS }) {
  const crossRequestCache = unstable_cache(fetcher, key, { tags, revalidate });
  return cache(crossRequestCache);
}
