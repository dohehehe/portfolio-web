import { getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { createEditorHtmlApplier } from "@/lib/editorjs/footnotes";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import DocumentFootnotes from "@/components/work/work/DocumentFootnotes";
import footnoteStyles from "@/components/work/work/EditorFootnotes.module.css";
import styles from "./EventCreditEditor.module.css";

function ParagraphBlock({ text, applyHtml }) {
  if (!text) {
    return null;
  }

  return (
    <p
      className={styles.paragraph}
      dangerouslySetInnerHTML={{ __html: applyHtml(text) }}
    />
  );
}

function HeaderBlock({ text, level = 2, applyHtml }) {
  if (!text) {
    return null;
  }

  const safeLevel = Math.min(Math.max(Number(level) || 2, 1), 6);
  const Tag = `h${safeLevel}`;

  return (
    <Tag
      className={`${styles.heading} ${styles[`heading${safeLevel}`]}`}
      dangerouslySetInnerHTML={{ __html: applyHtml(text) }}
    />
  );
}

function ImageBlock({ file, caption, applyHtml }) {
  const url = file?.url;

  if (!url) {
    return null;
  }

  return (
    <figure className={styles.figure}>
      <AspectRatioImage
        className={styles.image}
        src={url}
        alt={getCaptionPlainText(caption)}
        width={file?.width}
        height={file?.height}
      />
      {caption ? (
        <figcaption
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: applyHtml(caption) }}
        />
      ) : null}
    </figure>
  );
}

function EmbedBlock({ embed, caption, applyHtml }) {
  if (!embed) {
    return null;
  }

  return (
    <figure className={styles.embed}>
      <div dangerouslySetInnerHTML={{ __html: applyHtml(embed) }} />
      {caption ? (
        <figcaption
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: applyHtml(caption) }}
        />
      ) : null}
    </figure>
  );
}

function Block({ block, applyHtml }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.data?.text} applyHtml={applyHtml} />;
    case "header":
      return (
        <HeaderBlock
          text={block.data?.text}
          level={block.data?.level}
          applyHtml={applyHtml}
        />
      );
    case "image":
      return (
        <ImageBlock
          file={block.data?.file}
          caption={block.data?.caption}
          applyHtml={applyHtml}
        />
      );
    case "embed":
      return (
        <EmbedBlock
          embed={block.data?.embed}
          caption={block.data?.caption}
          applyHtml={applyHtml}
        />
      );
    default:
      return null;
  }
}

export default function EventCreditEditor({ data, className = "" }) {
  const blocks = normalizeBlocks(data);

  if (blocks.length === 0) {
    return null;
  }

  const { applyHtml, entries } = createEditorHtmlApplier(blocks);

  return (
    <div
      className={`${styles.editorCredit} ${footnoteStyles.root} ${className}`.trim()}
    >
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} applyHtml={applyHtml} />
      ))}
      <DocumentFootnotes footnotes={entries} />
    </div>
  );
}
