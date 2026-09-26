import { barlow } from "@/app/fonts";
import { normalizeGalleryItems } from "@/lib/locale/normalizeRecord";
import ProjectGallery from "@/components/work/gallery/ProjectGallery";
import EditorViewer from "@/components/editor/EditorViewer";
import ProjectEventList from "@/components/work/project/item-detail/ProjectEventList";
import ProjectTextList from "@/components/work/project/item-detail/ProjectTextList";
import styles from "@/components/work/project/item-detail/ProjectItemDetail.module.css";

const META_FIELDS = ["medium", "dimension"];

function getBilingualTitles(item) {
  return [...new Set([item.titleKo, item.titleEn].filter(Boolean))];
}

export default function ProjectItemDetail({
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
        <h1 className={styles.title}>
          {titles.length > 0
            ? titles.map((title) => (
              <span key={title} className={styles.titleLine}>
                {title}
              </span>
            ))
            : "Untitled"}
        </h1>
        <h2 className={styles.subtitle}>
          {item.year ? <div className={styles.year}>{item.year}</div> : null}

          {META_FIELDS.map((label) => {
            const value = item[label];

            if (!value) {
              return null;
            }

            return (
              <span key={label} className={styles.metaValue}>{value}</span>
            );
          })}

        </h2>
      </header>

      <ProjectGallery items={galleryItems} />

      <div className={styles.contentRow}>
        <EditorViewer
          data={item.content}
          styles={styles}
          rootClassName={styles.editorContent}
          includeHeaders
          as="section"
        />

        <div className={styles.creditRow}>
          <ProjectEventList items={cvs} locale={locale} styles={styles} />
          <ProjectTextList items={texts} locale={locale} styles={styles} />
          <EditorViewer
            data={item.credit}
            styles={styles}
            rootClassName={styles.creditContent}
            includeHeaders={false}
            as="section"
          />
        </div>
      </div>
    </article>
  );
}
