"use client";

import styles from "./CvItemMultiSelect.module.css";
import { getItemLabel } from "./linkCvItemUtils";

function CheckboxList({ title, items, selectedIds, onToggle, disabled }) {
  if (!items.length) {
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <p className={styles.empty}>항목이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => {
          const checked = selectedIds.includes(item.id);

          return (
            <li key={item.id} className={styles.item}>
              <label className={styles.checkboxLabel}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(item.id)}
                />
                <span className={styles.itemText}>{getItemLabel(item)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CvItemMultiSelect({
  projects = [],
  works = [],
  selectedProjectIds = [],
  selectedWorkIds = [],
  onToggleProject,
  onToggleWork,
  disabled = false,
  loading = false,
}) {
  if (loading) {
    return <p className={styles.status}>project / work 목록 불러오는 중...</p>;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>연결 항목 (link_cv_item)</span>
      <p className={styles.hint}>
        선택한 project / work마다 link_cv_item 레코드가 생성됩니다.
      </p>

      <div className={styles.grid}>
        <CheckboxList
          title="project"
          items={projects}
          selectedIds={selectedProjectIds}
          onToggle={onToggleProject}
          disabled={disabled}
        />

        <CheckboxList
          title="work"
          items={works}
          selectedIds={selectedWorkIds}
          onToggle={onToggleWork}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
