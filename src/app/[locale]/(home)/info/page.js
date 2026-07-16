import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata("/info", locale, "info");
}

export default function InfoPage() {
  return (
    <div>
    </div>
  );
}
