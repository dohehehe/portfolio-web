"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import {
  getLocaleFromPathname,
  localizedPath,
  stripLocaleFromPathname,
} from "@/lib/locale/routing";
import { barlow } from "@/app/fonts";
import { groupWorksByProject } from "./workListUtils";
import styles from "./workList.module.css";

function randomListShadow() {
  const hue = Math.floor(Math.random() * 360);

  return `hsl(${hue} 100% 54%)`;
}

function RowLink({ href, title, year }) {
  return (
    <Link className={styles.link} href={href}>
      <span className={styles.title}>{title || "-"}</span>
      {year ? <span className={styles.year}>{year}</span> : null}
    </Link>
  );
}

function WorkListItem({ href, title, year }) {
  return (
    <li className={styles.item}>
      <RowLink href={href} title={title} year={year} />
    </li>
  );
}

export default function WorkList({
  className = "",
  initialProjects = [],
  initialWorks = [],
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const path = stripLocaleFromPathname(pathname);
  const isHome = path === "/";
  const isWorkPage = path === "/work";
  const [listShadow, setListShadow] = useState(null);

  useEffect(() => {
    setListShadow(randomListShadow());
  }, []);

  const groupedProjects = useMemo(
    () => groupWorksByProject(initialProjects, initialWorks),
    [initialProjects, initialWorks]
  );

  if (groupedProjects.length === 0) {
    return null;
  }

  return (
    <ul
      className={`${barlow.variable} ${styles.list} ${isHome ? styles.listHome : ""} ${isWorkPage ? styles.listWork : ""} ${className}`.trim()}
      style={
        isHome && listShadow ? { "--list-home-shadow": listShadow } : undefined
      }
    >
      {groupedProjects.map((project) => (
        <li
          key={project.id}
          className={`${styles.projectGroup} ${styles.item}`}
        >
          <RowLink
            href={localizedPath(`/work/${project.id}`, locale)}
            title={pickLocalized(project, "title", locale)}
            year={project.year}
          />

          {project.works.length > 0 ? (
            <ul className={styles.workList}>
              {project.works.map((work) => (
                <WorkListItem
                  key={work.id}
                  href={localizedPath(`/work/${project.id}`, locale, work.id)}
                  title={pickLocalized(work, "title", locale)}
                  year={work.year}
                />
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
