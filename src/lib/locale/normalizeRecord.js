import { normalizeGallery } from "@/components/admin/forms/formUtils";
import { pickGalleryCaption, pickLocalized } from "./pickLocalized";

export function normalizeRecord(record, locale) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    year: record.year,
    project_id: record.project_id,
    created_at: record.created_at,
    title: pickLocalized(record, "title", locale),
    titleKo: pickLocalized(record, "title", "ko"),
    titleEn: pickLocalized(record, "title", "en"),
    medium: pickLocalized(record, "medium", locale),
    dimension: pickLocalized(record, "dimension", locale),
    content: pickLocalized(record, "content", locale),
    credit: pickLocalized(record, "credit", locale),
    gallery: record.gallery,
  };
}

export function normalizeGalleryItems(gallery, locale) {
  return normalizeGallery(gallery).map((item) => ({
    img_url: item.img_url,
    video_url: item.video_url,
    caption: pickGalleryCaption(item, locale),
  }));
}
