import { getSiteDescription } from "@/lib/data/info";
import { buildRootPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildRootPageMetadata(locale, await getSiteDescription(locale));
}

export default function Home() {
  return (
    <></>
  );
}
