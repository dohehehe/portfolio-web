import { localizedPath, stripLocaleFromPathname } from "./routing";

export function buildLanguageAlternates(pathname) {
  const path = stripLocaleFromPathname(pathname);

  return {
    ko: localizedPath(path, "ko"),
    en: localizedPath(path, "en"),
  };
}

export function getLocalizedMetadata(route, locale) {
  if (route.type === "standalone") {
    return {
      title: route.item.title || "Work",
      description: route.item.medium || undefined,
    };
  }

  if (route.scrollToId) {
    const work = route.works.find((item) => item.id === route.scrollToId);

    return {
      title: work?.title || route.project.title || "Work",
      description: work?.medium || route.project.medium || undefined,
    };
  }

  return {
    title: route.project.title || "Work",
    description: route.project.medium || undefined,
  };
}
