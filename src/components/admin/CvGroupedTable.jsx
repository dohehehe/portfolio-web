"use client";

import Link from "next/link";
import { useMemo } from "react";
import ActiveToggle from "./ActiveToggle";
import { getAdminColumnClass } from "./adminTableColumns";
import styles from "./AdminDataTables.module.css";

function sortCvs(items) {
  return [...items].sort((left, right) => {
    const yearLeft = left.year ?? "";
    const yearRight = right.year ?? "";

    if (yearLeft !== yearRight) {
      return yearRight.localeCompare(yearLeft, undefined, { numeric: true });
    }

    return (right.title_ko ?? right.title_en ?? "").localeCompare(
      left.title_ko ?? left.title_en ?? "",
    );
  });
}

export function groupCvsByType(cvs, cvTypes) {
  const byTypeId = new Map();

  for (const cv of cvs) {
    const key = cv.type_id ?? "__none__";

    if (!byTypeId.has(key)) {
      byTypeId.set(key, []);
    }

    byTypeId.get(key).push(cv);
  }

  const sortedTypes = [...cvTypes].sort((left, right) =>
    (left.name_ko ?? left.name_en ?? "").localeCompare(
      right.name_ko ?? right.name_en ?? "",
    ),
  );

  const groups = sortedTypes
    .map((type) => ({
      id: type.id,
      label: type.name_ko ?? type.name_en ?? type.id,
      items: sortCvs(byTypeId.get(type.id) ?? []),
    }))
    .filter((group) => group.items.length > 0);

  const uncategorized = sortCvs(byTypeId.get("__none__") ?? []);

  if (uncategorized.length) {
    groups.push({
      id: "__none__",
      label: "미분류",
      items: uncategorized,
    });
  }

  return groups;
}

function formatCellValue(value) {
  if (value == null || value === "") {
    return "-";
  }

  const text = String(value);

  if (text.length <= 80) {
    return text;
  }

  return `${text.slice(0, 80)}...`;
}

export default function CvGroupedTable({
  items,
  cvTypes,
  columns,
  editHref,
  deletingId,
  onDelete,
  onActiveUpdated,
}) {
  const groups = useMemo(() => groupCvsByType(items, cvTypes), [items, cvTypes]);

  if (!items.length) {
    return <p className={styles.status}>cv 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.cvGroupList}>
      {groups.map((group) => (
        <section key={group.id} className={styles.cvGroup}>
          <h3 className={styles.cvGroupTitle}>
            {group.label}
            <span className={styles.cvGroupCount}>{group.items.length}</span>
          </h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} className={getAdminColumnClass(column)}>
                      {column}
                    </th>
                  ))}
                  <th className={styles.colActions}>작업</th>
                  <th className={styles.colActive}>active</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td
                        key={column}
                        className={`${styles.textCell} ${getAdminColumnClass(column)}`}
                      >
                        {formatCellValue(item[column])}
                      </td>
                    ))}
                    <td className={`${styles.actionsCell} ${styles.colActions}`}>
                      <Link
                        className={styles.actionLink}
                        href={editHref(item.id)}
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
                    <td className={`${styles.activeCell} ${styles.colActive}`}>
                      <ActiveToggle
                        table="cv"
                        id={item.id}
                        isActive={item.is_active}
                        onUpdated={onActiveUpdated}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
