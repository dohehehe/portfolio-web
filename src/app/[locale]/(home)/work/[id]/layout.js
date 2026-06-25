import styles from "@/components/work/project/ProjectWorkPage.module.css";

export default function WorkDetailLayout({ children }) {
  return <main className={styles.main}>{children}</main>;
}
