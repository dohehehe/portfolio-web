"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useDeleteCv,
  useDeleteEvent,
  useDeleteInfo,
  useDeleteProject,
  useDeleteText,
  useDeleteWork,
} from "@/hooks";
import { useCvs } from "@/hooks/cv";
import { useCvTypes } from "@/hooks/cv_type";
import { useEvents } from "@/hooks/event";
import { useInfos } from "@/hooks/info";
import { useProjects } from "@/hooks/project";
import { useTexts } from "@/hooks/text";
import { useWorks } from "@/hooks/work";
import CvGroupedTable from "./CvGroupedTable";
import ProjectWorkGroupedTable from "./ProjectWorkGroupedTable";
import styles from "./AdminDataTables.module.css";

const ADMIN_TABLES = ["cv", "event", "project-work", "text", "info"];

const ADMIN_TABLE_CONFIG = {
  cv: {
    label: "CV",
    createHref: "/admin/cv/create",
    editHref: (id) => `/admin/cv/edit/${id}`,
    listColumns: ["created_at", "year", "title_ko", "event_title_ko"],
  },
  event: {
    label: "Event",
    createHref: "/admin/event/create",
    editHref: (id) => `/admin/event/edit/${id}`,
    listColumns: ["created_at", "date", "title_ko", "space_ko"],
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
    listColumns: ["created_at", "year", "title_ko", "writer_ko"],
  },
  info: {
    label: "Info",
    createHref: "/admin/info/create",
    editHref: (id) => `/admin/info/edit/${id}`,
    listColumns: ["created_at", "email", "bio_ko"],
  },
};

function sortByCreatedAt(items) {
  return [...items].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
}

function formatCreatedAt(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
  const cv = useCvs({ enabled: enabled && table === "cv" });
  const event = useEvents({ enabled: enabled && table === "event" });
  const info = useInfos({ enabled: enabled && table === "info" });
  const text = useTexts({ enabled: enabled && table === "text" });

  const states = { cv, event, info, text };
  return (
    states[table] ?? {
      data: [],
      loading: false,
      error: null,
      refetch: async () => [],
    }
  );
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
                  {column === "created_at"
                    ? formatCreatedAt(item[column])
                    : formatCellValue(item[column])}
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
  } = useProjects({ enabled: isProjectWork });
  const {
    data: works = [],
    loading: worksLoading,
    error: worksError,
    refetch: refetchWorks,
  } = useWorks({ enabled: isProjectWork });
  const { data: cvTypes = [], loading: cvTypesLoading } = useCvTypes({
    enabled: activeTable === "cv",
  });

  const isLoading = isProjectWork
    ? projectsLoading || worksLoading
    : loading || (activeTable === "cv" && cvTypesLoading);
  const tableError = isProjectWork ? projectsError || worksError : error;

  const cvDelete = useDeleteCv();
  const eventDelete = useDeleteEvent();
  const infoDelete = useDeleteInfo();
  const projectDelete = useDeleteProject();
  const textDelete = useDeleteText();
  const workDelete = useDeleteWork();

  const deleteHandlers = useMemo(
    () => ({
      cv: cvDelete.remove,
      event: eventDelete.remove,
      info: infoDelete.remove,
      text: textDelete.remove,
    }),
    [
      cvDelete.remove,
      eventDelete.remove,
      infoDelete.remove,
      textDelete.remove,
    ],
  );

  const sortedItems = useMemo(() => sortByCreatedAt(data), [data]);
  const config = ADMIN_TABLE_CONFIG[activeTable];

  async function handleDelete(id) {
    if (!window.confirm(`이 ${activeTable} 항목을 삭제할까요?`)) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteHandlers[activeTable](id);
      await refetch();
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
      await projectDelete.remove(id);
      await Promise.all([refetchProjects(), refetchWorks()]);
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
      await workDelete.remove(id);
      await refetchWorks();
    } catch (err) {
      window.alert(err.message ?? "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleOrdersSaved() {
    await refetchWorks();
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
            items={sortedItems}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
    </section>
  );
}
