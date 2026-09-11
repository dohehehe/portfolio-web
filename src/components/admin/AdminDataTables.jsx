"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useDeleteResource,
  useResourceList,
} from "@/hooks/useResource";
import CvGroupedTable from "./CvGroupedTable";
import ProjectWorkGroupedTable from "./ProjectWorkGroupedTable";
import styles from "./AdminDataTables.module.css";

const ADMIN_TABLES = ["cv", "event", "live", "project-work", "text", "info"];

const ADMIN_TABLE_CONFIG = {
  cv: {
    label: "CV",
    createHref: "/admin/cv/create",
    editHref: (id) => `/admin/cv/edit/${id}`,
    listColumns: ["year", "title_ko", "space_ko", "link_url"],
  },
  event: {
    label: "Event",
    createHref: "/admin/event/create",
    editHref: (id) => `/admin/event/edit/${id}`,
    listColumns: ["date", "title_ko", "space_ko"],
  },
  live: {
    label: "Live",
    createHref: "/admin/live/create",
    editHref: (id) => `/admin/live/edit/${id}`,
    listColumns: ["start_at", "end_at", "title_ko", "space_ko", "link_url"],
  },
  "project-work": {
    label: "Project / Work",
    tabLabel: "project / work",
    createLinks: [
      { href: "/admin/project/create", label: "Project 생성" },
      { href: "/admin/work/create", label: "Work 생성" },
    ],
  },
  text: {
    label: "Text",
    createHref: "/admin/text/create",
    editHref: (id) => `/admin/text/edit/${id}`,
    listColumns: ["year", "title_ko", "writer_ko"],
  },
  info: {
    label: "Info",
    createHref: "/admin/info/create",
    editHref: (id) => `/admin/info/edit/${id}`,
    listColumns: ["email", "bio_ko"],
  },
};

function formatCellValue(value) {
  if (value == null || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    const json = JSON.stringify(value);

    if (json.length <= 80) {
      return json;
    }

    return `${json.slice(0, 80)}...`;
  }

  const text = String(value);

  if (text.length <= 80) {
    return text;
  }

  return `${text.slice(0, 80)}...`;
}

function useAdminTableData(table, enabled) {
  const isResourceTable = table !== "project-work";

  return useResourceList(table, {
    enabled: enabled && isResourceTable,
  });
}

function ResourceTable({ table, items, deletingId, onDelete }) {
  const config = ADMIN_TABLE_CONFIG[table];
  const columns = config.listColumns;

  if (items.length === 0) {
    return <p className={styles.status}>{table} 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column} className={styles.textCell}>
                  {formatCellValue(item[column])}
                </td>
              ))}
              <td className={styles.actionsCell}>
                <Link
                  className={styles.actionLink}
                  href={config.editHref(item.id)}
                >
                  수정
                </Link>
                <button
                  className={styles.actionButton}
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => onDelete(item.id)}
                >
                  {deletingId === item.id ? "삭제 중..." : "삭제"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDataTables() {
  const [activeTable, setActiveTable] = useState(ADMIN_TABLES[0]);
  const [deletingId, setDeletingId] = useState(null);

  const isProjectWork = activeTable === "project-work";
  const { data, loading, error, refetch } = useAdminTableData(
    activeTable,
    !isProjectWork,
  );
  const {
    data: projects = [],
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useResourceList("project", { enabled: isProjectWork });
  const {
    data: works = [],
    loading: worksLoading,
    error: worksError,
    refetch: refetchWorks,
  } = useResourceList("work", { enabled: isProjectWork });
  const { data: cvTypes = [], loading: cvTypesLoading } = useResourceList(
    "cv_type",
    { enabled: activeTable === "cv" },
  );

  const isLoading = isProjectWork
    ? projectsLoading || worksLoading
    : loading || (activeTable === "cv" && cvTypesLoading);
  const tableError = isProjectWork ? projectsError || worksError : error;

  const deleteCv = useDeleteResource("cv");
  const deleteEvent = useDeleteResource("event");
  const deleteInfo = useDeleteResource("info");
  const deleteLive = useDeleteResource("live");
  const deleteProject = useDeleteResource("project");
  const deleteText = useDeleteResource("text");
  const deleteWork = useDeleteResource("work");

  const deleteHandlers = useMemo(
    () => ({
      cv: deleteCv.remove,
      event: deleteEvent.remove,
      info: deleteInfo.remove,
      live: deleteLive.remove,
      text: deleteText.remove,
    }),
    [
      deleteCv.remove,
      deleteEvent.remove,
      deleteInfo.remove,
      deleteLive.remove,
      deleteText.remove,
    ],
  );

  const config = ADMIN_TABLE_CONFIG[activeTable];

  async function handleDelete(id) {
    if (!window.confirm(`이 ${activeTable} 항목을 삭제할까요?`)) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteHandlers[activeTable](id);
      await refetch({ force: true });
    } catch (err) {
      window.alert(err.message ?? "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteProject(id) {
    if (!window.confirm("이 project 항목을 삭제할까요?")) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteProject.remove(id);
      await Promise.all([
        refetchProjects({ force: true }),
        refetchWorks({ force: true }),
      ]);
    } catch (err) {
      window.alert(err.message ?? "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteWork(id) {
    if (!window.confirm("이 work 항목을 삭제할까요?")) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteWork.remove(id);
      await refetchWorks({ force: true });
    } catch (err) {
      window.alert(err.message ?? "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleOrdersSaved() {
    await refetchWorks({ force: true });
  }

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <div className={styles.toggleGroup}>
          {ADMIN_TABLES.map((table) => (
            <button
              key={table}
              className={`${styles.toggleButton} ${
                activeTable === table ? styles.toggleButtonActive : ""
              }`}
              type="button"
              onClick={() => setActiveTable(table)}
            >
              {ADMIN_TABLE_CONFIG[table].tabLabel ?? table}
            </button>
          ))}
        </div>

        {config.createLinks ? (
          <div className={styles.createLinks}>
            {config.createLinks.map((link) => (
              <Link
                key={link.href}
                className={styles.createLink}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : (
          <Link className={styles.createLink} href={config.createHref}>
            {config.label} 생성
          </Link>
        )}
      </div>

      {isLoading && <p className={styles.status}>Loading...</p>}

      {!isLoading && tableError && (
        <p className={`${styles.status} ${styles.error}`}>
          {tableError.message}
        </p>
      )}

      {!isLoading && !tableError && activeTable === "cv" && (
        <CvGroupedTable
          items={data}
          cvTypes={cvTypes}
          columns={config.listColumns}
          editHref={config.editHref}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}

      {!isLoading && !tableError && isProjectWork && (
        <ProjectWorkGroupedTable
          projects={projects}
          works={works}
          deletingId={deletingId}
          onDeleteProject={handleDeleteProject}
          onDeleteWork={handleDeleteWork}
          onOrdersSaved={handleOrdersSaved}
        />
      )}

      {!isLoading &&
        !tableError &&
        activeTable !== "cv" &&
        !isProjectWork && (
          <ResourceTable
            table={activeTable}
            items={data}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
    </section>
  );
}
