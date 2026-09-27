import { notFound } from "next/navigation";
import { barlow } from "@/app/fonts";
import JsonLd from "@/components/seo/JsonLd";
import EditorViewer from "@/components/editor/EditorViewer";
import textEditorStyles from "@/components/text/TextEditor.module.css";
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

      <section className={`${barlow.variable} ${styles.section}`}>
        <div className={styles.textHeader}>
          {text.type?.name ? (
            <div className={styles.type}>{text.type.name}</div>
          ) : null}
          <TextRelatedList items={relatedItems} locale={locale} />
        </div>
        <div className={styles.textBody}>
          <EditorViewer
            data={text.content}
            styles={textEditorStyles}
            rootClassName={textEditorStyles.editorContent}
            includeHeaders
          />
        </div>
      </section>
    </>
  );
}
