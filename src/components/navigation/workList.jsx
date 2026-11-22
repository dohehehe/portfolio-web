"use client";

import Link from "next/link";
import { useMemo } from "react";
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

function RowLink({ href, title, year }) {
  return (
    <Link className={styles.link} href={href}>
      <span className={styles.title}>{title || "-"}</span>
      {year ? <span className={styles.year}>{year}</span> : null}
    </Link>
  );
}

function WorkListItem({ href, title, year, blurDelay }) {
  return (
    <li className={styles.item} style={blurDelayStyle(blurDelay)}>
      <RowLink href={href} title={title} year={year} />
    </li>
  );
}

function blurDelayStyle(delay) {
  return delay ? { "--blur-delay": delay } : undefined;
}

function getHomeBlurDelays(projects) {
  const ids = [];

  for (const project of projects) {
    ids.push(`project:${project.id}`);

    for (const work of project.works) {
      ids.push(`work:${work.id}`);
    }
  }

  if (ids.length <= 1) {
    return null;
  }

  const step = 7 / ids.length;

  return new Map(
    ids.map((id, index) => [id, `${(-index * step).toFixed(3)}s`]),
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

  const groupedProjects = useMemo(
    () => groupWorksByProject(initialProjects, initialWorks),
    [initialProjects, initialWorks],
  );
  const blurDelays = useMemo(
    () => (isHome ? getHomeBlurDelays(groupedProjects) : null),
    [groupedProjects, isHome],
  );

  if (groupedProjects.length === 0) {
    return null;
  }

  return (
    <ul
      className={`${barlow.variable} ${styles.list} ${isHome ? styles.listHome : ""} ${isWorkPage ? styles.listWork : ""} ${className}`.trim()}
    >
      {groupedProjects.map((project) => (
        <li
          key={project.id}
          className={`${styles.projectGroup} ${styles.item}`}
          style={blurDelayStyle(blurDelays?.get(`project:${project.id}`))}
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
                  blurDelay={blurDelays?.get(`work:${work.id}`)}
                />
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
