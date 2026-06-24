"use client";

import Link from "next/link";
import WorkList from "./workList";
import styles from "./navigation.module.css";

export default function Navigation() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div className={styles.navigationSection}>
          <Link className={styles.navigationLink} href="/work">
            project - work
          </Link>
          <WorkList />
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
