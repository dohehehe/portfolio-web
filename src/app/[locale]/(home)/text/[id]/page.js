import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { getTextById } from "@/lib/data/text";
import {
  buildDetailPageMetadata,
  getTextMetadata,
} from "@/lib/locale/metadata";
import { buildArticleJsonLd } from "@/lib/structured-data/buildJsonLd";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const text = await getTextById(id, locale);

  if (!text) {
    return { title: "Not found" };
  }

  return buildDetailPageMetadata(`/text/${id}`, locale, getTextMetadata(text));
}

export default async function TextDetailPage({ params }) {
  const { locale, id } = await params;
  const text = await getTextById(id, locale);

  if (!text) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          text,
          locale,
          pathname: `/text/${id}`,
        })}
      />
    </>
  );
}
