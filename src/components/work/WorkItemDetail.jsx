import EditorContent from "./EditorContent";
import WorkGallery from "./WorkGallery";
import styles from "./workDetail.module.css";

function MetaField({ label, valueKo, valueEn }) {
  if (!valueKo && !valueEn) {
    return null;
  }

  return (
    <div className={styles.metaField}>
      <span className={styles.metaLabel}>{label}</span>
      {valueKo ? <p className={styles.metaValue}>{valueKo}</p> : null}
      {valueEn ? <p className={styles.metaValueEn}>{valueEn}</p> : null}
    </div>
  );
}

function ContentSection({ title, dataKo, dataEn }) {
  const hasKo = Boolean(dataKo);
  const hasEn = Boolean(dataEn);

  if (!hasKo && !hasEn) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {hasKo ? (
        <div className={styles.localeBlock}>
          <span className={styles.localeLabel}>ko</span>
          <EditorContent data={dataKo} />
        </div>
      ) : null}
      {hasEn ? (
        <div className={styles.localeBlock}>
          <span className={styles.localeLabel}>en</span>
          <EditorContent data={dataEn} />
        </div>
      ) : null}
    </section>
  );
}

export default function WorkItemDetail({ id, item, className = "" }) {
  return (
    <article
      id={id}
      className={`${styles.article} ${className}`.trim()}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{item.title_ko || item.title_en || "Untitled"}</h1>
          {item.year ? <span className={styles.year}>{item.year}</span> : null}
        </div>

        {item.title_en && item.title_ko ? (
          <p className={styles.titleEn}>{item.title_en}</p>
        ) : null}

        <MetaField
          label="medium"
          valueKo={item.medium_ko}
          valueEn={item.medium_en}
        />
        <MetaField
          label="dimension"
          valueKo={item.dimension_ko}
          valueEn={item.dimension_en}
        />
      </header>

      <WorkGallery gallery={item.gallery} />

      <ContentSection title="content" dataKo={item.content_ko} dataEn={item.content_en} />
      <ContentSection title="credit" dataKo={item.credit_ko} dataEn={item.credit_en} />
    </article>
  );
}
