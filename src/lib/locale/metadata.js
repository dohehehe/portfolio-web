import { getFirstGalleryImageUrl } from "@/components/admin/forms/formUtils";
import { getEditorParagraphPlainText } from "@/lib/editorjs/getEditorParagraphPlainText";
import {
  getLocalizedArtistName,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site/constants";
import { localizedPath, stripLocaleFromPathname } from "./routing";

export function buildListPageTitle(label) {
  return `${label} - ${SITE_NAME}`;
}

export function buildRootPageMetadata(locale, description = SITE_NAME) {
  const title = SITE_NAME;
  const canonical = getCanonicalUrl("/", locale);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/"),
    },
  };
}

export function buildListPageMetadata(pathname, locale, label, description = SITE_NAME) {
  const title = buildListPageTitle(label);
  const canonical = getCanonicalUrl(pathname, locale);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
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
  const prefixParts = [getLocalizedArtistName(locale)];
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
  return appendEditorParagraphs(
    formatEventMetadataPrefix(event, locale),
    event.credit,
  );
}

function formatEventMetadataPrefix(event, locale) {
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

  return prefixParts.join(", ") || "Event";
}

export function getEventMetadata(event, locale) {
  return {
    title: formatEventMetadataPrefix(event, locale),
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

export function getWorkMetadataSource(route) {
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
