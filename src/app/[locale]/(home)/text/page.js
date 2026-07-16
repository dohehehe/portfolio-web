import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata("/text", locale, "text");
}

export default function TextPage() {
  return (
    <div>
    </div>
  );
}
