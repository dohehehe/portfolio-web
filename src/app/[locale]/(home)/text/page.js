import { getSiteDescription } from "@/lib/data/info";
import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata(
    "/text",
    locale,
    "text",
    await getSiteDescription(locale),
  );
}

export default function TextPage() {
  return (
    <div>
    </div>
  );
}
