import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import WorkGallery from "@/components/work/gallery/WorkGallery";
import EditorContent from "./EditorContent";
import EditorCredit from "./EditorCredit";
import styles from "./WorkItemDetail.module.css";

function getBilingualTitles(item) {
  return [...new Set([item.titleKo, item.titleEn].filter(Boolean))];
}

function MetaField({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className={styles.metaField}>
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
      <EditorContent data={data} styles={styles} />
    </section>
  );
}

function CreditSection({ data }) {
  if (!data) {
    return null;
  }

  return <section className={styles.section}>
    <EditorCredit data={data} styles={styles} />
  </section>;
}


export default function WorkItemDetail({ id, item, className = "", locale }) {
  const galleryItems = normalizeGalleryItems(item.gallery, locale);
  const titles = getBilingualTitles(item);

  return (
    <article id={id} className={`${styles.article} ${className}`.trim()}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            {titles.length > 0
              ? titles.map((title) => (
                <span key={title} className={styles.titleLine}>
                  {title}
                </span>
              ))
              : "Untitled"}
          </h1>
          {item.year ? <span className={styles.year}>{item.year}</span> : null}
        </div>

        <MetaField label="medium" value={item.medium} />
        <MetaField label="dimension" value={item.dimension} />
      </header>

      <WorkGallery items={galleryItems} />

      <ContentSection title="content" data={item.content} />
      <CreditSection title="credit" data={item.credit} />
    </article>
  );
}

