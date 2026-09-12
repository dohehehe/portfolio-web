import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import EventEditor from "../editors/EventEditor";
import RelatedTextList from "./RelatedTextList";
import RelatedWorkList from "./RelatedWorkList";
import styles from "./EventSidebar.module.css";

export default function EventSidebar({
  content,
  credit,
  texts = [],
  works = [],
  locale,
}) {
  const hasContent = normalizeBlocks(content).length > 0;
  const hasCredit = normalizeBlocks(credit).length > 0;
  const hasTexts = texts.length > 0;
  const hasWorks = works.length > 0;

  if (!hasContent && !hasCredit && !hasTexts && !hasWorks) {
    return null;
  }

  return (
    <>
      {hasContent ? (
        <section className={styles.contentSection} aria-label="content">
          <EventEditor data={content} variant="content" />
        </section>
      ) : null}
      <RelatedTextList items={texts} locale={locale} />
      {hasCredit ? (
        <section className={styles.creditSection} aria-label="credit">
          <EventEditor data={credit} variant="credit" />
        </section>
      ) : null}
      <RelatedWorkList items={works} locale={locale} />
    </>
  );
}
