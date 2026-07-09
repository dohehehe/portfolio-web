import { DEFAULT_LOCALE, LOCALES } from "./constants";

export const LOCALE_HEADER = "x-portfolio-locale";

export function isSupportedLocale(locale) {
  return LOCALES.includes(locale);
}

export function getLocaleFromPathname(pathname) {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname) {
  if (pathname === "/en") {
    return "/";
  }

  if (pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }

  return pathname;
}

export function localizedPath(pathname, locale, hash = "") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const hashSuffix = hash ? `#${hash.replace(/^#/, "")}` : "";

  if (locale === DEFAULT_LOCALE) {
    return `${path}${hashSuffix}`;
  }

  const enPath = path === "/" ? "/en" : `/en${path}`;
  return `${enPath}${hashSuffix}`;
}

export function swapLocalePathname(pathname, locale) {
  const path = stripLocaleFromPathname(pathname);
  return localizedPath(path, locale);
}

export function getInternalLocalePath(pathname, locale) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

const LIST_ONLY_ROUTES = new Set(["/work", "/text", "/event", "/info"]);

export function isDetailRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);

  if (LIST_ONLY_ROUTES.has(path)) {
    return false;
  }

  const segments = path.split("/").filter(Boolean);
  return segments.length === 2;
}

export function shouldSkipLocaleRouting(pathname) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next")
  );
}
