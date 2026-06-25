import LanguageSwitch from "@/components/locale/LanguageSwitch";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import styles from "@/components/work/workDetail.module.css";

export default function WorkDetailLayout({ children }) {
  return (
    <LocaleProvider>
      <main className={styles.main}>
        <LanguageSwitch />
        {children}
      </main>
    </LocaleProvider>
  );
}
