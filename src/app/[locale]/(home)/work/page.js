import { getSiteDescription } from "@/lib/data/info";
import { buildListPageMetadata } from "@/lib/locale/metadata";
import HomeImage from "@/components/home/homeImage";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata(
    "/work",
    locale,
    "work",
    await getSiteDescription(locale),
  );
}

export default function WorkPage() {
  return (
    <>
          {/* <HomeImage /> */}
    </>
  );
}
