import EditorViewer from "@/components/editor/EditorViewer";
import contentStyles from "./EventEditorContent.module.css";
import creditStyles from "./EventEditorCredit.module.css";

const STYLES_BY_VARIANT = {
  content: contentStyles,
  credit: creditStyles,
};

export default function EventEditor({ data, variant = "credit", className = "" }) {
  const styles = STYLES_BY_VARIANT[variant] ?? creditStyles;

  return (
    <EditorViewer
      data={data}
      styles={styles}
      rootClassName={styles.editorContent}
      includeHeaders
      className={className}
    />
  );
}
