"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useProjects } from "@/hooks/project";
import { useWorks } from "@/hooks/work";
import { groupWorksByProject } from "./workListUtils";
import styles from "./workList.module.css";

function RowLink({ href, titleKo, year }) {
  return (
    <Link className={styles.link} href={href}>
      <span className={styles.title}>{titleKo || "-"}</span>
      {year ? <span className={styles.year}>{year}</span> : null}
    </Link>
  );
}

function WorkListItem({ href, titleKo, year }) {
  return (
    <li className={styles.item}>
      <RowLink href={href} titleKo={titleKo} year={year} />
    </li>
  );
}

export default function WorkList({ className = "" }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { data: projects = [], loading: projectsLoading, error: projectsError } =
    useProjects();
  const { data: works = [], loading: worksLoading, error: worksError } = useWorks();

  const groupedProjects = useMemo(
    () => groupWorksByProject(projects, works),
    [projects, works],
  );

  const loading = projectsLoading || worksLoading;
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
            href={`/project/${project.id}`}
            titleKo={project.title_ko}
            year={project.year}
          />

          {project.works.length > 0 ? (
            <ul className={styles.workList}>
              {project.works.map((work) => (
                <WorkListItem
                  key={work.id}
                  href={`/work/${work.id}`}
                  titleKo={work.title_ko}
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
