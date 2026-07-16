import { getFirstGalleryImageUrl } from "@/components/admin/forms/formUtils";
import { getEditorParagraphPlainText } from "@/lib/editorjs/getEditorParagraphPlainText";
import { SITE_URL } from "@/lib/site/constants";
import { localizedPath, stripLocaleFromPathname } from "./routing";

const WORK_ARTIST_NAME = "곽도희";
const SITE_NAME = "dohee kwak";

export function buildListPageTitle(label) {
  return `${label} - ${SITE_NAME}`;
}

export function buildListPageMetadata(pathname, locale, label) {
  const title = buildListPageTitle(label);
  const canonical = getCanonicalUrl(pathname, locale);

  return {
    title,
    openGraph: {
      title,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates(pathname),
    },
  };
}

export function getCanonicalUrl(pathname, locale) {
  return new URL(localizedPath(pathname, locale), SITE_URL).toString();
}

export function buildLanguageAlternates(pathname) {
  const path = stripLocaleFromPathname(pathname);

  return {
    ko: localizedPath(path, "ko"),
    en: localizedPath(path, "en"),
  };
}

export function buildDetailPageMetadata(pathname, locale, { title, description, imageUrl }) {
  const canonical = getCanonicalUrl(pathname, locale);
  const openGraph = {
    title,
    description,
    url: canonical,
    ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
  };

  const twitter = {
    card: imageUrl ? "summary_large_image" : "summary",
    title,
    description,
    ...(imageUrl ? { images: [imageUrl] } : {}),
  };

  return {
    title,
    description,
    openGraph,
    twitter,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(pathname),
    },
  };
}

function appendEditorParagraphs(prefix, content) {
  const paragraphText = getEditorParagraphPlainText(content);

  if (!paragraphText) {
    return prefix || undefined;
  }

  if (!prefix) {
    return paragraphText;
  }

  return `${prefix} ${paragraphText}`;
}

function formatLocalizedTitle(title, locale, koWrapper) {
  if (!title) {
    return null;
  }

  if (locale === "ko") {
    return `${koWrapper.open}${title}${koWrapper.close}`;
  }

  return title;
}

function formatWorkMetadataPrefix(item, locale) {
  const prefixParts = [WORK_ARTIST_NAME];
  const formattedTitle = formatLocalizedTitle(item.title, locale, {
    open: "〈",
    close: "〉",
  });

  if (formattedTitle) {
    prefixParts.push(formattedTitle);
  }

  const meta = [item.year, item.medium, item.dimension].filter(Boolean).join(". ");

  if (meta) {
    prefixParts.push(meta);
  }

  return prefixParts.join(", ") || "Work";
}

export function formatWorkDescription(item, locale) {
  return appendEditorParagraphs(
    formatWorkMetadataPrefix(item, locale),
    item.content,
  );
}

export function formatEventDescription(event, locale) {
  const prefixParts = [];
  const formattedTitle = formatLocalizedTitle(event.title, locale, {
    open: "《",
    close: "》",
  });

  if (formattedTitle) {
    prefixParts.push(formattedTitle);
  }

  if (event.date) {
    prefixParts.push(event.date);
  }

  if (event.space) {
    prefixParts.push(event.space);
  }

  return appendEditorParagraphs(prefixParts.join(", "), event.credit);
}

export function getEventMetadata(event, locale) {
  return {
    title: event.title || "Event",
    description: formatEventDescription(event, locale),
    imageUrl: getFirstGalleryImageUrl(event.gallery),
  };
}

export function getTextMetadata(text) {
  const descriptionParts = [text.writer, text.year].filter(Boolean);

  return {
    title: text.title || "Text",
    description:
      descriptionParts.length > 0 ? descriptionParts.join(", ") : undefined,
  };
}

function getWorkMetadataSource(route) {
  if (route.type === "standalone") {
    return route.item;
  }

  if (route.scrollToId) {
    return (
      route.works.find((item) => item.id === route.scrollToId) ?? route.project
    );
  }

  return route.project;
}

export function getLocalizedMetadata(route, locale) {
  const source = getWorkMetadataSource(route);

  return {
    title: formatWorkMetadataPrefix(source, locale),
    description: formatWorkDescription(source, locale),
    imageUrl: getFirstGalleryImageUrl(source.gallery),
  };
}
