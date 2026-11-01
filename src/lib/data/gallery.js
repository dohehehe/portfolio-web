import "server-only";

import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { isPubliclyVisible } from "@/lib/data/publicVisibility";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { localizedPath } from "@/lib/locale/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const HOME_GALLERY_SELECT = `
  id,
  created_at,
  img_url,
  project_id,
  project:project_id (
    id,
    title_ko,
    title_en,
    is_active
  )
`;

const fetchHomeGallery = createCachedQuery(
  async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery")
      .select(HOME_GALLERY_SELECT)
      .not("img_url", "is", null)
      .order("created_at", { ascending: true });

    if (error) {
      return [];
    }

    return (data ?? []).filter(
      (row) =>
        row.img_url &&
        row.project_id &&
        row.project &&
        isPubliclyVisible(row.project)
    );
  },
  {
    key: ["home-gallery"],
    tags: [DATA_CACHE_TAG.gallery, DATA_CACHE_TAG.project],
  }
);

export async function getHomeGallerySlides(locale) {
  const rows = await fetchHomeGallery();

  return rows.map((row) => ({
    key: row.id,
    href: localizedPath(`/work/${row.project_id}`, locale),
    src: row.img_url,
    alt: pickLocalized(row.project, "title", locale) || "",
  }));
}
