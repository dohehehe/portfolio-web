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
import { useProjects } from "@/hooks/project";
import { useWorks } from "@/hooks/work";
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

function WorkListItem({ href, title, year }) {
  return (
    <li className={styles.item}>
      <RowLink href={href} title={title} year={year} />
    </li>
  );
}

export default function WorkList({ className = "" }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const path = stripLocaleFromPathname(pathname);
  const isHome = path === "/";
  const { data: projects = [], loading: projectsLoading, error: projectsError } =
    useProjects();
  const { data: works = [], loading: worksLoading, error: worksError } = useWorks();

  const groupedProjects = useMemo(
    () => groupWorksByProject(projects, works),
    [projects, works],
  );

  const error = projectsError ?? worksError;

  if (error) {
    return <p className={styles.status}>목록을 불러오지 못했습니다.</p>;
  }

  return (
    <ul
      className={`${styles.list} ${isHome ? styles.listHome : ""} ${className}`.trim()}
    >
      {groupedProjects.map((project) => (
        <li key={project.id} className={`${styles.projectGroup} ${styles.item}`}>
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
