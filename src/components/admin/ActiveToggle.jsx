"use client";

import { useEffect, useState } from "react";
import { updateResource } from "@/hooks/useResource";
import styles from "./ActiveToggle.module.css";

export const TABLES_WITH_IS_ACTIVE = new Set([
  "cv",
  "event",
  "live",
  "project",
  "text",
  "work",
]);

export default function ActiveToggle({ table, id, isActive, onUpdated }) {
  const [checked, setChecked] = useState(Boolean(isActive));
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setChecked(Boolean(isActive));
  }, [isActive]);

  async function handleChange(event) {
    const next = event.target.checked;
    setChecked(next);
    setUpdating(true);

    try {
      await updateResource(table, id, { is_active: next });
      await onUpdated?.();
    } catch (err) {
      setChecked(!next);
      window.alert(err.message ?? "활성 상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <label className={styles.toggle} title={checked ? "활성" : "비활성"}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={updating}
        onChange={handleChange}
        aria-label="활성 상태"
      />
      <span className={styles.slider} aria-hidden="true" />
    </label>
  );
}
