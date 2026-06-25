export function pickLocalized(item, field, locale) {
  if (!item) {
    return null;
  }

  const primary = item[`${field}_${locale}`];
  const fallbackLocale = locale === "ko" ? "en" : "ko";
  const fallback = item[`${field}_${fallbackLocale}`];

  return primary ?? fallback ?? null;
}

export function pickGalleryCaption(item, locale) {
  const primary =
    locale === "ko" ? item.caption_ko : item.caption_en;
  const fallback =
    locale === "ko" ? item.caption_en : item.caption_ko;

  return primary || fallback || "";
}
