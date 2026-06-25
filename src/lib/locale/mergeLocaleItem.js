export function mergeLocaleItem(koItem, enItem, locale) {
  if (locale === "ko" || !enItem) {
    return koItem;
  }

  return {
    ...koItem,
    ...enItem,
  };
}
