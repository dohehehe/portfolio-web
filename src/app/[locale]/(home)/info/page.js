import JsonLd from "@/components/seo/JsonLd";
import { getSiteDescription } from "@/lib/data/info";
import { buildListPageMetadata } from "@/lib/locale/metadata";
import { buildPersonJsonLd } from "@/lib/structured-data/buildJsonLd";

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

  return (
    <>
      <JsonLd data={buildPersonJsonLd(locale)} />
      <div>
      </div>
    </>
  );
}
