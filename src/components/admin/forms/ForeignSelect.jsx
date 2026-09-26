"use client";

import { useEffect, useState } from "react";
import { fetchResourceOptions } from "@/hooks/useResource";
import styles from "../AdminForm.module.css";

export default function ForeignSelect({
  foreignTable,
  labelKey,
  value,
  onChange,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setLoading(true);

      try {
        const items = await fetchResourceOptions(foreignTable);

        if (!cancelled) {
          setOptions(items);
        }
      } catch {
        if (!cancelled) {
          setOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [foreignTable]);

  return (
    <select
      className={styles.select}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={loading}
    >
      <option value="">선택 안 함</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option[labelKey] ?? option.id}
        </option>
      ))}
    </select>
  );
}
