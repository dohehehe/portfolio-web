import styles from "./admin.module.css";

export default function AdminLayout({ children }) {
  return <main className={styles.adminLayout}>{children}</main>;
}
