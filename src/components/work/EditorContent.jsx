import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import styles from "./workDetail.module.css";

function ParagraphBlock({ text }) {
  if (!text) {
    return null;
  }

  return (
    <p
      className={styles.paragraph}
      dangerouslySetInnerHTML={{ __html: text }}
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
      <img className={styles.image} src={url} alt={caption || ""} />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

function EmbedBlock({ embed, caption }) {
  if (!embed) {
    return null;
  }

  return (
    <figure className={styles.embed}>
      <div dangerouslySetInnerHTML={{ __html: embed }} />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.data?.text} />;
    case "image":
      return (
        <ImageBlock file={block.data?.file} caption={block.data?.caption} />
      );
    case "embed":
      return (
        <EmbedBlock embed={block.data?.embed} caption={block.data?.caption} />
      );
    default:
      return null;
  }
}

export default function EditorContent({ data, className = "" }) {
  const blocks = normalizeBlocks(data);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.editorContent} ${className}`.trim()}>
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
