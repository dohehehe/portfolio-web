function visibleText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function blockHasVisibleContent(block) {
  const data = block?.data;

  if (!data || typeof data !== "object") {
    return false;
  }

  if (visibleText(data.text).length > 0 || visibleText(data.caption).length > 0) {
    return true;
  }

  if (data.file?.url || visibleText(data.embed).length > 0 || visibleText(data.source).length > 0) {
    return true;
  }

  if (block.type === "paragraph" || block.type === "header") {
    return false;
  }

  return Object.keys(data).length > 0;
}

function hasEditorContent(value) {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(blockHasVisibleContent);
  }

  if (typeof value === "object" && Array.isArray(value.blocks)) {
    return value.blocks.some(blockHasVisibleContent);
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
  const fallback = item[`${field}_${locale === "ko" ? "en" : "ko"}`];

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
