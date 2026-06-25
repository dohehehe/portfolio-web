function hasEditorContent(value) {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object" && Array.isArray(value.blocks)) {
    return value.blocks.length > 0;
  }

  return true;
}

export function hasLocalizedValue(value) {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "object") {
    return hasEditorContent(value);
  }

  return true;
}

export function pickLocalized(item, field, locale) {
  if (!item) {
    return null;
  }

  const primary = item[`${field}_${locale}`];
  const fallbackLocale = locale === "ko" ? "en" : "ko";
  const fallback = item[`${field}_${fallbackLocale}`];

  if (hasLocalizedValue(primary)) {
    return primary;
  }

  if (hasLocalizedValue(fallback)) {
    return fallback;
  }

  return null;
}

export function pickGalleryCaption(item, locale) {
  const primary = locale === "ko" ? item.caption_ko : item.caption_en;
  const fallback = locale === "ko" ? item.caption_en : item.caption_ko;

  if (hasLocalizedValue(primary)) {
    return primary.trim();
  }

  if (hasLocalizedValue(fallback)) {
    return fallback.trim();
  }

  return "";
}
