import EditorContent from "@/components/work/work/EditorContent";
import contentStyles from "./EventEditorContent.module.css";
import creditStyles from "./EventEditorCredit.module.css";
import noteStyles from "./EventEditorNote.module.css";

const STYLES_BY_VARIANT = {
  content: contentStyles,
  credit: creditStyles,
  note: noteStyles,
};

export default function EventEditor({ data, variant = "credit", className = "" }) {
  return (
    <EditorContent
      data={data}
      className={className}
      styles={STYLES_BY_VARIANT[variant]}
    />
  );
}
