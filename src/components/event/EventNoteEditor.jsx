import EditorContent from "@/components/work/work/EditorContent";
import styles from "./EventNoteEditor.module.css";

export default function EventNoteEditor({ data, className = "" }) {
  return <EditorContent data={data} className={className} styles={styles} />;
}
