import { getSiteDescription } from "@/lib/data/info";
import { buildRootPageMetadata } from "@/lib/locale/metadata";
import Live from "@/components/live/Live";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildRootPageMetadata(locale, await getSiteDescription(locale));
}

export default async function Home({ params }) {
  const { locale } = await params;

  return (
    <>
      <Live locale={locale} />
    </>
  );
}
