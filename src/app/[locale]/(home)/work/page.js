import { buildListPageMetadata } from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return buildListPageMetadata("/work", locale, "work");
}

export default function WorkPage() {
  return (
    <></>
  );
}
