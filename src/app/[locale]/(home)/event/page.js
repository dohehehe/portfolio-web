import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata("/event", locale, "event");
}

export default function EventPage() {
  return <></>;
}
