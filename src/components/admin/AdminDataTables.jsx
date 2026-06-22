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
import { useEvents } from "@/hooks/event";
import { useInfos } from "@/hooks/info";
import { useProjects } from "@/hooks/project";
import { useTexts } from "@/hooks/text";
import { useWorks } from "@/hooks/work";
import styles from "./AdminDataTables.module.css";

const ADMIN_TABLES = ["cv", "event", "info", "project", "text", "work"];

const ADMIN_TABLE_CONFIG = {
  cv: {
    label: "CV",
    createHref: "/admin/cv/create",
    editHref: (id) => `/admin/cv/edit/${id}`,
    listColumns: ["created_at", "year", "title_ko", "title_en"],
  },
  event: {
    label: "Event",
    createHref: "/admin/event/create",
    editHref: (id) => `/admin/event/edit/${id}`,
    listColumns: ["created_at", "date", "title_ko", "title_en", "space_ko"],
  },
  info: {
    label: "Info",
    createHref: "/admin/info/create",
    editHref: (id) => `/admin/info/edit/${id}`,
    listColumns: ["created_at", "email", "bio_ko"],
  },
  project: {
    label: "Project",
    createHref: "/admin/project/create",
    editHref: (id) => `/admin/project/edit/${id}`,
    listColumns: ["created_at", "year", "title_ko", "title_en"],
  },
  text: {
    label: "Text",
    createHref: "/admin/text/create",
    editHref: (id) => `/admin/text/edit/${id}`,
    listColumns: ["created_at", "year", "title_ko", "writer_ko"],
  },
  work: {
    label: "Work",
    createHref: "/admin/work/create",
    editHref: (id) => `/admin/work/edit/${id}`,
    listColumns: ["created_at", "year", "title_ko", "medium_ko"],
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
  const project = useProjects({ enabled: enabled && table === "project" });
  const text = useTexts({ enabled: enabled && table === "text" });
  const work = useWorks({ enabled: enabled && table === "work" });

  const states = { cv, event, info, project, text, work };
  return states[table];
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

  const { data, loading, error, refetch } = useAdminTableData(activeTable, true);

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
      project: projectDelete.remove,
      text: textDelete.remove,
      work: workDelete.remove,
    }),
    [
      cvDelete.remove,
      eventDelete.remove,
      infoDelete.remove,
      projectDelete.remove,
      textDelete.remove,
      workDelete.remove,
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
              {table}
            </button>
          ))}
        </div>

        <Link className={styles.createLink} href={config.createHref}>
          {config.label} 생성
        </Link>
      </div>

      {loading && <p className={styles.status}>Loading...</p>}

      {!loading && error && (
        <p className={`${styles.status} ${styles.error}`}>{error.message}</p>
      )}

      {!loading && !error && (
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
