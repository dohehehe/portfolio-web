import styles from "@/components/work/workDetail.module.css";

export default function WorkDetailLayout({ children }) {
  return <main className={styles.main}>{children}</main>;
}
