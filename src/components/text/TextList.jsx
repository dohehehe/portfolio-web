"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import {
  getLocaleFromPathname,
  localizedPath,
} from "@/lib/locale/routing";
import styles from "./TextList.module.css";

export default function TextList({
  className = "",
  texts = [],
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  if (texts.length === 0) {
    return null;
  }

  return (
    <ul className={`${styles.list} ${className}`.trim()}>
      {texts.map((text) => {
        const title = pickLocalized(text, "title", locale);
        const writer = pickLocalized(text, "writer", locale);

        if (!title && !writer && !text.year) {
          return null;
        }

        return (
          <li key={text.id} className={styles.item}>
            <Link
              className={styles.link}
              href={localizedPath(`/text/${text.id}`, locale)}
            >
              <span className={styles.title}>
                {title || "-"}
                {writer ? `, ${writer}` : ""}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
