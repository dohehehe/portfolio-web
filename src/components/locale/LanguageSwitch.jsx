"use client";

import { useLocale } from "./LocaleProvider";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { locale, setLocale, ready } = useLocale();

  if (!ready) {
    return null;
  }

  return (
    <div className={styles.switch} role="group" aria-label="Language">
      <button
        type="button"
        className={`${styles.button} ${locale === "ko" ? styles.buttonActive : ""}`.trim()}
        onClick={() => setLocale("ko")}
        aria-pressed={locale === "ko"}
      >
        ko
      </button>
      <button
        type="button"
        className={`${styles.button} ${locale === "en" ? styles.buttonActive : ""}`.trim()}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        en
      </button>
    </div>
  );
}
