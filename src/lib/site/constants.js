export const SITE_URL = "https://www.doheekwak.com";
export const SITE_NAME = "Dohee Kwak 곽도희";
export const ARTIST_NAME_KO = "곽도희";
export const ARTIST_NAME_EN = "Dohee Kwak";

export function getLocalizedArtistName(locale) {
  return locale === "en" ? ARTIST_NAME_EN : ARTIST_NAME_KO;
}
