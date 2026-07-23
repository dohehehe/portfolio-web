import EditorContent from "@/components/work/work/EditorContent";
import styles from "./TextEditor.module.css";

export default function TextEditor({ data, className = "" }) {
  return <EditorContent data={data} className={className} styles={styles} />;
}
