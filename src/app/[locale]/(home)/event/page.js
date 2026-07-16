import { getSiteDescription } from "@/lib/data/info";
import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata(
    "/event",
    locale,
    "event",
    await getSiteDescription(locale),
  );
}

export default function EventPage() {
  return <></>;
}
