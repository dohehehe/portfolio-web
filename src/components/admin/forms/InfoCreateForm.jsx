"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateInfo } from "@/hooks/info";
import styles from "../AdminForm.module.css";

export default function InfoCreateForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [bioKo, setBioKo] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateInfo();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        email: email.trim() || null,
        bio_ko: bioKo.trim() || null,
        bio_en: bioEn.trim() || null,
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setSubmitError(error.message ?? "Info 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Info 생성</h1>
          <p className={styles.description}>info 테이블</p>
        </div>
        <Link className={styles.backLink} href="/admin">
          목록으로
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          bio_ko
          <textarea
            className={styles.textarea}
            value={bioKo}
            onChange={(event) => setBioKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          bio_en
          <textarea
            className={styles.textarea}
            value={bioEn}
            onChange={(event) => setBioEn(event.target.value)}
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
