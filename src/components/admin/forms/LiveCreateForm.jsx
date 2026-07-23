"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateLive } from "@/hooks/live";
import styles from "../AdminForm.module.css";

export default function LiveCreateForm() {
  const router = useRouter();

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateLive();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        space_ko: spaceKo.trim() || null,
        space_en: spaceEn.trim() || null,
        start_at: startAt.trim() || null,
        end_at: endAt.trim() || null,
        link_url: linkUrl.trim() || null,
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setSubmitError(error.message ?? "Live 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live 생성</h1>
          <p className={styles.description}>live 테이블</p>
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
          space_ko
          <input
            className={styles.input}
            type="text"
            value={spaceKo}
            onChange={(event) => setSpaceKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          space_en
          <input
            className={styles.input}
            type="text"
            value={spaceEn}
            onChange={(event) => setSpaceEn(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          start_at
          <input
            className={styles.input}
            type="date"
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          end_at
          <input
            className={styles.input}
            type="date"
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          link_url
          <input
            className={styles.input}
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
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
