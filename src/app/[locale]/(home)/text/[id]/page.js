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
import { buildArticleJsonLd } from "@/lib/structured-data/buildJsonLd";
import styles from "@/components/text/TextDetailPage.module.css";

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
  const titles = [...new Set([text.titleKo, text.titleEn].filter(Boolean))];

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          text,
          locale,
          pathname: `/text/${id}`,
        })}
      />
      <section className={`${barlow.variable} ${styles.section}`}>
        <div className={styles.textHeader}>
          <h1 className={styles.title}>
            {titles.length > 0
              ? titles.map((title) => (
                  <span key={title} className={styles.titleLine}>
                    {title}
                  </span>
                ))
              : "Untitled"}
          </h1>
          {text.year ? <p className={styles.year}>{text.year}</p> : null}
          {text.writer ? <p className={styles.writer}>{text.writer}</p> : null}
        </div>
        <div className={styles.textBody}>
          <TextEditor data={text.content} />
        </div>
        <div className={styles.relatedPanel}>
          <TextRelatedList items={relatedItems} locale={locale} />
        </div>
      </section>
    </>
  );
}
