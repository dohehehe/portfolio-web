import { notFound } from "next/navigation";
import { barlow } from "@/app/fonts";
import JsonLd from "@/components/seo/JsonLd";
import TextEditor from "@/components/text/TextEditor";
import TextRelatedList from "@/components/text/TextRelatedList";
import { getRelatedItemsByText, getTextById } from "@/lib/data/text";
import {
  buildDetailPageMetadata,
  getTextMetadata,
} from "@/lib/locale/metadata";
import { generateTextDetailStaticParams } from "@/lib/data/staticParams";
import { buildArticleJsonLd } from "@/lib/structured-data/buildJsonLd";
import styles from "@/components/text/TextDetailPage.module.css";

export async function generateStaticParams() {
  return generateTextDetailStaticParams();
}

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

  const relatedItems = await getRelatedItemsByText(text, locale);

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          text,
          locale,
          pathname: `/text/${id}`,
        })}
      />
      <div className={styles.textHeader}>
        <h1 className={styles.title}>{text.title || "Untitled"}</h1>
        {text.writer ? <p className={styles.writer}>{text.writer}</p> : null}
        {text.year ? <p className={styles.year}>{text.year}</p> : null}



      </div>
      <section className={`${barlow.variable} ${styles.section}`}>
        <div className={styles.relatedPanel}>
          <TextRelatedList items={relatedItems} locale={locale} />
        </div>
        <div className={styles.textBody}>
          <TextEditor data={text.content} />
        </div>

      </section>
    </>
  );
}
