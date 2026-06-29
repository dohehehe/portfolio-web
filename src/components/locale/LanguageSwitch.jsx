"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  swapLocalePathname,
} from "@/lib/locale/routing";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const pathname = usePathname();
  const activeLocale = getLocaleFromPathname(pathname);

  return (
    <div className={styles.switch} role="group" aria-label="Language">
      <Link
        href={swapLocalePathname(pathname, "ko")}
        className={`${styles.button} ${activeLocale === "ko" ? styles.buttonActive : ""}`.trim()}
        aria-current={activeLocale === "ko" ? "page" : undefined}
      >
        ko
      </Link>
      <Link
        href={swapLocalePathname(pathname, "en")}
        className={`${styles.button} ${activeLocale === "en" ? styles.buttonActive : ""}`.trim()}
        aria-current={activeLocale === "en" ? "page" : undefined}
      >
        en
      </Link>
    </div>
  );
}
