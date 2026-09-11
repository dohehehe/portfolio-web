import { getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { createEditorHtmlApplier } from "@/lib/editorjs/footnotes";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import DocumentFootnotes from "./DocumentFootnotes";
import footnoteStyles from "./EditorFootnotes.module.css";
import defaultStyles from "./WorkItemDetail.module.css";

function ParagraphBlock({ text, applyHtml, styles }) {
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

function HeaderBlock({ text, level = 2, applyHtml, styles }) {
  if (!text) {
    return null;
  }

  const safeLevel = Math.min(Math.max(level, 1), 6);
  const Tag = `h${safeLevel}`;
  const levelClassName = {
    1: styles.editorHeader1,
    2: styles.editorHeader2,
    3: styles.editorHeader3,
    4: styles.editorHeader4,
  }[safeLevel];

  return (
    <Tag
      className={`${styles.editorHeader} ${levelClassName ?? ""}`.trim()}
      dangerouslySetInnerHTML={{ __html: applyHtml(text) }}
    />
  );
}

function ImageBlock({ file, caption, applyHtml, styles }) {
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

function EmbedBlock({ embed, caption, applyHtml, styles }) {
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

function Block({ block, applyHtml, styles }) {
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphBlock text={block.data?.text} applyHtml={applyHtml} styles={styles} />
      );
    case "header":
      return (
        <HeaderBlock
          text={block.data?.text}
          level={block.data?.level}
          applyHtml={applyHtml}
          styles={styles}
        />
      );
    case "image":
      return (
        <ImageBlock
          file={block.data?.file}
          caption={block.data?.caption}
          applyHtml={applyHtml}
          styles={styles}
        />
      );
    case "embed":
      return (
        <EmbedBlock
          embed={block.data?.embed}
          caption={block.data?.caption}
          applyHtml={applyHtml}
          styles={styles}
        />
      );
    default:
      return null;
  }
}

export default function EditorContent({
  data,
  className = "",
  styles = defaultStyles,
}) {
  const blocks = normalizeBlocks(data);

  if (blocks.length === 0) {
    return null;
  }

  const { applyHtml, entries } = createEditorHtmlApplier(blocks);

  return (
    <div
      className={`${styles.editorContent} ${footnoteStyles.root} ${className}`.trim()}
    >
      {blocks.map((block, index) => (
        <Block
          key={`${block.type}-${index}`}
          block={block}
          applyHtml={applyHtml}
          styles={styles}
        />
      ))}
      <DocumentFootnotes footnotes={entries} />
    </div>
  );
}
