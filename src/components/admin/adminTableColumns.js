import styles from "./AdminDataTables.module.css";

const COLUMN_WIDTH_CLASS = {
  year: "colYear",
  date: "colDate",
  start_at: "colDate",
  end_at: "colDate",
  title_ko: "colTitle",
  space_ko: "colSpace",
  link_url: "colLink",
  writer_ko: "colWriter",
  email: "colEmail",
  bio_ko: "colBio",
};

export function getAdminColumnClass(column) {
  const key = COLUMN_WIDTH_CLASS[column];

  return key ? styles[key] : styles.colDefault;
}
