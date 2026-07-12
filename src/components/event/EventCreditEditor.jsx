import { normalizeEditorHtml, getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import Caption from "@/components/ui/Caption";
import styles from "./EventCreditEditor.module.css";

function ParagraphBlock({ text }) {
  if (!text) {
    return null;
  }

  return (
    <p
      className={styles.paragraph}
      dangerouslySetInnerHTML={{ __html: normalizeEditorHtml(text) }}
    />
  );
}

function HeaderBlock({ text, level = 2 }) {
  if (!text) {
    return null;
  }

  const safeLevel = Math.min(Math.max(Number(level) || 2, 1), 6);
  const Tag = `h${safeLevel}`;

  return (
    <Tag
      className={`${styles.heading} ${styles[`heading${safeLevel}`]}`}
      dangerouslySetInnerHTML={{ __html: normalizeEditorHtml(text) }}
    />
  );
}

function ImageBlock({ file, caption }) {
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
      <Caption as="figcaption" className={styles.caption} text={caption} />
    </figure>
  );
}

function EmbedBlock({ embed, caption }) {
  if (!embed) {
    return null;
  }

  return (
    <figure className={styles.embed}>
      <div dangerouslySetInnerHTML={{ __html: normalizeEditorHtml(embed) }} />
      <Caption as="figcaption" className={styles.caption} text={caption} />
    </figure>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.data?.text} />;
    case "header":
      return (
        <HeaderBlock
          text={block.data?.text}
          level={block.data?.level}
        />
      );
    case "image":
      return (
        <ImageBlock
          file={block.data?.file}
          caption={block.data?.caption}
        />
      );
    case "embed":
      return (
        <EmbedBlock
          embed={block.data?.embed}
          caption={block.data?.caption}
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

  return (
    <div className={`${styles.editorCredit} ${className}`.trim()}>
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
