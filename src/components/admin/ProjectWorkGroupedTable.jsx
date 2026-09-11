"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  sortByYearDesc,
  sortWorksByOrder,
} from "@/components/navigation/workListUtils";
import { updateResource } from "@/hooks/useResource";
import styles from "./AdminDataTables.module.css";

export function buildProjectWorkGroups(projects, works) {
  const worksByProjectId = new Map();
  const standalone = [];

  for (const work of works) {
    if (!work.project_id) {
      standalone.push(work);
      continue;
    }

    const projectWorks = worksByProjectId.get(work.project_id) ?? [];
    projectWorks.push(work);
    worksByProjectId.set(work.project_id, projectWorks);
  }

  const groups = sortByYearDesc(projects).map((project) => ({
    id: project.id,
    kind: "project",
    project,
    works: sortWorksByOrder(worksByProjectId.get(project.id) ?? []),
  }));

  if (standalone.length > 0) {
    groups.push({
      id: "__standalone__",
      kind: "standalone",
      project: null,
      works: sortWorksByOrder(standalone),
    });
  }

  return groups;
}

function moveWork(works, index, direction) {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= works.length) {
    return works;
  }

  const next = [...works];
  const [item] = next.splice(index, 1);
  next.splice(targetIndex, 0, item);
  return next;
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

function getGroupWorkSignature(groups) {
  return groups
    .map((group) => `${group.id}:${group.works.map((work) => work.id).join(",")}`)
    .join("|");
}

function orderMatches(work, index) {
  return work.order != null && Number(work.order) === index;
}

export default function ProjectWorkGroupedTable({
  projects,
  works,
  deletingId,
  onDeleteProject,
  onDeleteWork,
  onOrdersSaved,
}) {
  const initialGroups = useMemo(
    () => buildProjectWorkGroups(projects, works),
    [projects, works],
  );
  const baselineSignature = useMemo(
    () => getGroupWorkSignature(initialGroups),
    [initialGroups],
  );
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const groups =
    draft?.baselineSignature === baselineSignature
      ? draft.groups
      : initialGroups;
  const dirty =
    draft?.baselineSignature === baselineSignature &&
    getGroupWorkSignature(draft.groups) !== baselineSignature;

  function handleMove(groupId, workIndex, direction) {
    setDraft((current) => {
      const baseGroups =
        current?.baselineSignature === baselineSignature
          ? current.groups
          : initialGroups;

      return {
        baselineSignature,
        groups: baseGroups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            works: moveWork(group.works, workIndex, direction),
          };
        }),
      };
    });
    setSaveError(null);
  }

  async function handleSaveOrder() {
    setSaving(true);
    setSaveError(null);

    try {
      const updates = [];

      for (const group of groups) {
        group.works.forEach((work, index) => {
          if (!orderMatches(work, index)) {
            updates.push(updateResource("work", work.id, { order: index }));
          }
        });
      }

      await Promise.all(updates);
      setDraft(null);
      await onOrdersSaved?.();
    } catch (err) {
      setSaveError(err.message ?? "순서 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (!projects.length && !works.length) {
    return <p className={styles.status}>project / work 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.projectWorkList}>
      <div className={styles.orderToolbar}>
        <p className={styles.orderHint}>
          프로젝트 안 work 순서를 ↑↓ 로 바꾼 뒤 저장하세요.
        </p>
        <button
          className={styles.saveOrderButton}
          type="button"
          disabled={!dirty || saving}
          onClick={handleSaveOrder}
        >
          {saving ? "저장 중..." : "순서 저장"}
        </button>
      </div>

      {saveError && (
        <p className={`${styles.status} ${styles.error}`}>{saveError}</p>
      )}

      {groups.map((group) => (
        <section key={group.id} className={styles.projectGroup}>
          {group.kind === "project" ? (
            <div className={styles.projectRow}>
              <div className={styles.projectMeta}>
                <h3 className={styles.projectTitle}>
                  {formatCellValue(group.project.title_ko)}
                </h3>
                <span className={styles.metaChip}>
                  {formatCellValue(group.project.year)}
                </span>
                <span className={styles.workCount}>
                  work {group.works.length}
                </span>
              </div>
              <div className={styles.actionsCell}>
                <Link
                  className={styles.actionLink}
                  href={`/admin/project/edit/${group.project.id}`}
                >
                  수정
                </Link>
                <button
                  className={styles.actionButton}
                  type="button"
                  disabled={deletingId === group.project.id}
                  onClick={() => onDeleteProject(group.project.id)}
                >
                  {deletingId === group.project.id ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          ) : (
            <h3 className={styles.projectTitle}>미분류 work</h3>
          )}

          {group.works.length === 0 ? (
            <p className={styles.emptyWorks}>연결된 work가 없습니다.</p>
          ) : (
            <ul className={styles.workList}>
              {group.works.map((work, index) => (
                <li key={work.id} className={styles.workRow}>
                  <div className={styles.reorderControls}>
                    <button
                      className={styles.reorderButton}
                      type="button"
                      aria-label="위로"
                      disabled={index === 0 || saving}
                      onClick={() => handleMove(group.id, index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      className={styles.reorderButton}
                      type="button"
                      aria-label="아래로"
                      disabled={index === group.works.length - 1 || saving}
                      onClick={() => handleMove(group.id, index, 1)}
                    >
                      ↓
                    </button>
                    <span className={styles.orderIndex}>{index}</span>
                  </div>

                  <div className={styles.workMeta}>
                    <span className={styles.workTitle}>
                      {formatCellValue(work.title_ko)}
                    </span>
                    <span className={styles.metaChip}>
                      {formatCellValue(work.year)}
                    </span>
                    <span className={styles.metaChip}>
                      {formatCellValue(work.medium_ko)}
                    </span>
                  </div>

                  <div className={styles.actionsCell}>
                    <Link
                      className={styles.actionLink}
                      href={`/admin/work/edit/${work.id}`}
                    >
                      수정
                    </Link>
                    <button
                      className={styles.actionButton}
                      type="button"
                      disabled={deletingId === work.id}
                      onClick={() => onDeleteWork(work.id)}
                    >
                      {deletingId === work.id ? "삭제 중..." : "삭제"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
