"use client";

import { useLocale } from "@/components/locale/LocaleProvider";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import EditorContent from "./EditorContent";
import WorkGallery from "./WorkGallery";
import styles from "./workDetail.module.css";

function MetaField({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className={styles.metaField}>
      <span className={styles.metaLabel}>{label}</span>
      <p className={styles.metaValue}>{value}</p>
    </div>
  );
}

function ContentSection({ title, data }) {
  if (!data) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <EditorContent data={data} />
    </section>
  );
}

export default function WorkItemDetail({ id, item, className = "" }) {
  const { locale } = useLocale();

  const title = pickLocalized(item, "title", locale);
  const medium = pickLocalized(item, "medium", locale);
  const dimension = pickLocalized(item, "dimension", locale);
  const content = pickLocalized(item, "content", locale);
  const credit = pickLocalized(item, "credit", locale);

  return (
    <article id={id} className={`${styles.article} ${className}`.trim()}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title || "Untitled"}</h1>
          {item.year ? <span className={styles.year}>{item.year}</span> : null}
        </div>

        <MetaField label="medium" value={medium} />
        <MetaField label="dimension" value={dimension} />
      </header>

      <WorkGallery gallery={item.gallery} />

      <ContentSection title="content" data={content} />
      <ContentSection title="credit" data={credit} />
    </article>
  );
}
