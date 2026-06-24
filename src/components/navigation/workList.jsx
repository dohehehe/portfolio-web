"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProjects } from "@/hooks/project";
import { useWorks } from "@/hooks/work";
import { groupWorksByProject } from "./workListUtils";
import styles from "./workList.module.css";

function ListItem({ href, titleKo, year }) {
  return (
    <li className={styles.item}>
      <Link className={styles.link} href={href}>
        <span className={styles.title}>{titleKo || "-"}</span>
        {year ? <span className={styles.year}>{year}</span> : null}
      </Link>
    </li>
  );
}

export default function WorkList() {
  const { data: projects = [], loading: projectsLoading, error: projectsError } =
    useProjects();
  const { data: works = [], loading: worksLoading, error: worksError } = useWorks();

  const groupedProjects = useMemo(
    () => groupWorksByProject(projects, works),
    [projects, works],
  );

  const loading = projectsLoading || worksLoading;
  const error = projectsError ?? worksError;

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.status}>목록을 불러오지 못했습니다.</p>;
  }

  if (groupedProjects.length === 0) {
    return <p className={styles.status}>등록된 project가 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {groupedProjects.map((project) => (
        <li key={project.id} className={styles.projectGroup}>
          <ListItem
            href={`/project/${project.id}`}
            titleKo={project.title_ko}
            year={project.year}
          />

          {project.works.length > 0 ? (
            <ul className={styles.workList}>
              {project.works.map((work) => (
                <ListItem
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
