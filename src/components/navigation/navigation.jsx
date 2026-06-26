"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  localizedPath,
  stripLocaleFromPathname,
} from "@/lib/locale/routing";
import WorkList from "./workList";
import styles from "./navigation.module.css";

function isWorkListRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/" || path === "/work";
}

export default function Navigation({ initialProjects = [], initialWorks = [] }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const workListActive = isWorkListRoute(pathname);

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div
          className={`${styles.navigationSection} ${workListActive ? styles.workListVisible : ""}`}
        >
          <Link className={styles.navigationLink} href={localizedPath("/work", locale)}>
            project - work
          </Link>
          <WorkList
            className={styles.workList}
            initialProjects={initialProjects}
            initialWorks={initialWorks}
          />
        </div>

        <Link className={styles.navigationLink} href={localizedPath("/event", locale)}>
          installation
        </Link>
        <Link className={styles.navigationLink} href={localizedPath("/text", locale)}>
          text
        </Link>
        <Link className={styles.navigationLink} href={localizedPath("/info", locale)}>
          dohee kwak
        </Link>
      </nav>
    </header>
  );
}
