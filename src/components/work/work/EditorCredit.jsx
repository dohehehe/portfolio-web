import { normalizeEditorHtml, getCaptionPlainText } from "@/lib/editorjs/normalizeEditorHtml";
import { normalizeBlocks } from "@/lib/editorjs/normalizeBlocks";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import Caption from "@/components/ui/Caption";
import defaultStyles from "./WorkItemDetail.module.css";

function ParagraphBlock({ text, styles }) {
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

function ImageBlock({ file, caption, styles }) {
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

function EmbedBlock({ embed, caption, styles }) {
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

function Block({ block, styles }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.data?.text} styles={styles} />;
    case "image":
      return (
        <ImageBlock
          file={block.data?.file}
          caption={block.data?.caption}
          styles={styles}
        />
      );
    case "embed":
      return (
        <EmbedBlock
          embed={block.data?.embed}
          caption={block.data?.caption}
          styles={styles}
        />
      );
    default:
      return null;
  }
}

export default function EditorCredit({
  data,
  className = "",
  styles = defaultStyles,
}) {
  const blocks = normalizeBlocks(data);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.editorCredit} ${className}`.trim()}>
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} styles={styles} />
      ))}
    </div>
  );
}
