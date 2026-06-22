"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateCv } from "@/hooks/cv";
import ForeignSelect from "./ForeignSelect";
import styles from "../AdminForm.module.css";

export default function CvCreateForm() {
  const router = useRouter();

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [typeId, setTypeId] = useState("");
  const [exhibitionId, setExhibitionId] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateCv();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        type_id: typeId || null,
        exhibition_id: exhibitionId || null,
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setSubmitError(error.message ?? "CV 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CV 생성</h1>
          <p className={styles.description}>cv 테이블</p>
        </div>
        <Link className={styles.backLink} href="/admin">
          목록으로
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          title_ko
          <input
            className={styles.input}
            type="text"
            value={titleKo}
            onChange={(event) => setTitleKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          title_en
          <input
            className={styles.input}
            type="text"
            value={titleEn}
            onChange={(event) => setTitleEn(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          year
          <input
            className={styles.input}
            type="text"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          type_id
          <ForeignSelect
            foreignTable="cv_type"
            labelKey="name_ko"
            value={typeId}
            onChange={setTypeId}
          />
        </label>

        <label className={styles.label}>
          exhibition_id
          <ForeignSelect
            foreignTable="event"
            labelKey="title_ko"
            value={exhibitionId}
            onChange={setExhibitionId}
          />
        </label>

        {submitError ? <p className={styles.error}>{submitError}</p> : null}

        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "저장 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
