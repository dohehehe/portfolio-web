import { barlow } from "@/app/fonts";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import WorkGallery from "@/components/work/gallery/WorkGallery";
import ProjectEventList from "@/components/work/project/item-detail/ProjectEventList";
import ProjectTextList from "@/components/work/project/item-detail/ProjectTextList";
import EditorViewer from "@/components/editor/EditorViewer";
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
    <EditorViewer
      data={data}
      styles={styles}
      rootClassName={styles.editorContent}
      includeHeaders
    />
  );
}

function CreditSection({ data }) {
  if (!data) {
    return null;
  }

  return (
    <EditorViewer
      data={data}
      styles={styles}
      rootClassName={styles.editorCredit}
      includeHeaders={false}
    />
  );
}

function SubContentSection({ cvs = [], texts = [], locale }) {
  if (!cvs.length && !texts.length) {
    return null;
  }

  return (
    <div className={styles.subContent}>
      <ProjectEventList items={cvs} locale={locale} styles={styles} />
      <ProjectTextList items={texts} locale={locale} styles={styles} />
    </div>
  );
}


export default function WorkItemDetail({
  id,
  item,
  cvs = [],
  texts = [],
  className = "",
  locale,
}) {
  const galleryItems = normalizeGalleryItems(item.gallery, locale);
  const titles = getBilingualTitles(item);

  return (
    <article id={id} className={`${barlow.variable} ${styles.article} ${className}`.trim()}>
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

        <MetaField label="medium" value={item.medium} classname={styles.metaField} />
        <MetaField label="dimension" value={item.dimension} classname={styles.metaField} />
        {item.credit ? (
            <div className={styles.creditField}>
              <CreditSection data={item.credit} />
            </div>
          ) : null}

        <div className={styles.contentRow}>
          <ContentSection title="content" data={item.content} />
            {cvs.length || texts.length ? (
                <SubContentSection cvs={cvs} texts={texts} locale={locale} />
            ) : null}
        </div>
        </header>
      <div className={styles.contentContainer}>
        <WorkGallery items={galleryItems} />
      </div>
    </article>
  );
}

