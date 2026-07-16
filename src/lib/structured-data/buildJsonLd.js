import { getFirstGalleryImageUrl } from "@/components/admin/forms/formUtils";
import { getCanonicalUrl } from "@/lib/locale/metadata";
import {
  ARTIST_NAME_KO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site/constants";

function extractFirstIsoDate(dateString) {
  const match = dateString?.match(/(\d{4})[.\-/](\d{2})[.\-/](\d{2})/);

  if (!match) {
    return undefined;
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function buildArtistReference() {
  return {
    "@type": "Person",
    name: ARTIST_NAME_KO,
    alternateName: SITE_NAME,
    url: SITE_URL,
  };
}

export function buildPersonJsonLd(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "ko" ? ARTIST_NAME_KO : SITE_NAME,
    alternateName: [ARTIST_NAME_KO, SITE_NAME],
    url: getCanonicalUrl("/info", locale),
    sameAs: [SITE_URL],
    jobTitle: locale === "ko" ? "예술가" : "Artist",
    hasOccupation: {
      "@type": "Occupation",
      name: locale === "ko" ? "시각 예술가" : "Visual Artist",
    },
  };
}

export function buildVisualArtworkJsonLd({ item, locale, pathname }) {
  const imageUrl = getFirstGalleryImageUrl(item.gallery);

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: item.title || "Work",
    creator: buildArtistReference(),
    ...(item.year ? { dateCreated: item.year } : {}),
    ...(item.medium ? { artMedium: item.medium } : {}),
    ...(item.dimension ? { size: item.dimension } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: getCanonicalUrl(pathname, locale),
  };
}

export function buildExhibitionEventJsonLd({ event, locale, pathname }) {
  const imageUrl = getFirstGalleryImageUrl(event.gallery);
  const startDate = extractFirstIsoDate(event.date);

  return {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: event.title || "Event",
    ...(startDate ? { startDate } : {}),
    ...(event.date ? { description: event.date } : {}),
    ...(event.space
      ? {
          location: {
            "@type": "Place",
            name: event.space,
          },
        }
      : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: getCanonicalUrl(pathname, locale),
    organizer: buildArtistReference(),
  };
}

export function buildArticleJsonLd({ text, locale, pathname }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title || "Text",
    ...(text.writer
      ? {
          author: {
            "@type": "Person",
            name: text.writer,
          },
        }
      : {}),
    ...(text.year ? { datePublished: text.year } : {}),
    url: getCanonicalUrl(pathname, locale),
  };
}
