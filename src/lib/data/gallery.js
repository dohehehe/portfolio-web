import "server-only";

import { createCachedQuery, DATA_CACHE_TAG } from "@/lib/data/cache";
import { isPubliclyVisible } from "@/lib/data/publicVisibility";
import { getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { pickGalleryCaption, pickLocalized } from "@/lib/locale/pickLocalized";
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
    is_active,
    gallery
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
    key: ["home-gallery-caption"],
    tags: [DATA_CACHE_TAG.gallery, DATA_CACHE_TAG.project],
  }
);

function captionForImage(gallery, imgUrl, locale) {
  if (!Array.isArray(gallery) || !imgUrl) {
    return "";
  }

  const item = gallery.find((entry) => entry?.img_url === imgUrl);

  return item ? pickGalleryCaption(item, locale) : "";
}

export async function getHomeGallerySlides(locale) {
  const rows = await fetchHomeGallery();

  return rows.map((row) => {
    const caption = captionForImage(row.project?.gallery, row.img_url, locale);

    return {
      key: row.id,
      href: localizedPath(`/work/${row.project_id}`, locale),
      src: row.img_url,
      alt: getCaptionPlainText(caption) || pickLocalized(row.project, "title", locale) || "",
      caption,
    };
  });
}
