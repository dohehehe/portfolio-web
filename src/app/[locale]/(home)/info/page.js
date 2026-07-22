import { barlow } from "@/app/fonts";
import InfoBio from "@/components/info/InfoBio";
import InfoCvList from "@/components/info/InfoCvList";
import JsonLd from "@/components/seo/JsonLd";
import { getCvsGroupedByType } from "@/lib/data/cv";
import { getInfo, getSiteDescription } from "@/lib/data/info";
import { buildListPageMetadata } from "@/lib/locale/metadata";
import { buildPersonJsonLd } from "@/lib/structured-data/buildJsonLd";
import styles from "@/components/info/InfoPage.module.css";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata(
    "/info",
    locale,
    "info",
    await getSiteDescription(locale),
  );
}

export default async function InfoPage({ params }) {
  const { locale } = await params;
  const [info, cvGroups] = await Promise.all([
    getInfo(locale),
    getCvsGroupedByType(locale),
  ]);

  return (
    <>
      <JsonLd data={buildPersonJsonLd(locale)} />
      <section className={`${barlow.variable} ${styles.section}`}>
        <InfoBio info={info} />
      </section>
      <section className={`${barlow.variable} ${styles.cvSection}`}>
        <InfoCvList groups={cvGroups} locale={locale} />
      </section>
    </>
  );
}
