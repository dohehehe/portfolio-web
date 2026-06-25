import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES } from "./constants";

function isSupportedLocale(value) {
  return LOCALES.includes(value);
}

function getBrowserLocale() {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const language = navigator.language.toLowerCase();

  if (language.startsWith("ko")) {
    return "ko";
  }

  if (language.startsWith("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function readStoredLocale() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return isSupportedLocale(stored) ? stored : null;
}

export function detectInitialLocale() {
  return readStoredLocale() ?? getBrowserLocale();
}

export function persistLocale(locale) {
  if (typeof window === "undefined" || !isSupportedLocale(locale)) {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
