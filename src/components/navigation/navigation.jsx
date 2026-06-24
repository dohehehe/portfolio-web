"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WorkList from "./workList";
import styles from "./navigation.module.css";

function isWorkListRoute(pathname) {
  return pathname === "/" || pathname === "/work";
}

export default function Navigation() {
  const pathname = usePathname();
  const workListActive = isWorkListRoute(pathname);

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div
          className={`${styles.navigationSection} ${workListActive ? styles.workListVisible : ""}`}
        >
          <Link className={styles.navigationLink} href="/work">
            project - work
          </Link>
          <WorkList className={styles.workList} />
        </div>

        <Link className={styles.navigationLink} href="/event">
          installation
        </Link>
        <Link className={styles.navigationLink} href="/text">
          text
        </Link>
        <Link className={styles.navigationLink} href="/info">
          dohee kwak
        </Link>
      </nav>
    </header>
  );
}
