"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDeleteInfo, useInfo, useUpdateInfo } from "@/hooks/info";
import styles from "../AdminForm.module.css";

export default function InfoEditForm({ id }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [bioKo, setBioKo] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: infoItem, loading, error } = useInfo(id);
  const { update, loading: updating } = useUpdateInfo();
  const { remove, loading: deleting } = useDeleteInfo();

  useEffect(() => {
    if (!infoItem) {
      return;
    }

    setEmail(infoItem.email ?? "");
    setBioKo(infoItem.bio_ko ?? "");
    setBioEn(infoItem.bio_en ?? "");
  }, [infoItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        email: email.trim() || null,
        bio_ko: bioKo.trim() || null,
        bio_en: bioEn.trim() || null,
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Info 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 info 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Info 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!infoItem) {
    return <p className={styles.error}>Info를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Info 수정</h1>
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

        <div className={styles.formActions}>
          <button className={styles.submitButton} type="submit" disabled={saving}>
            {updating ? "저장 중..." : "수정 저장"}
          </button>

          <button
            className={styles.deleteButton}
            type="button"
            disabled={saving}
            onClick={handleDelete}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </form>
    </div>
  );
}
