import { notFound } from "next/navigation";
import { getTextById } from "@/lib/data/text";
import {
  buildDetailPageMetadata,
  getTextMetadata,
} from "@/lib/locale/metadata";

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

  return <></>;
}
