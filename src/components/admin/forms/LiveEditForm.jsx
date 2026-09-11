"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useDeleteResource,
  useResourceItem,
  useUpdateResource,
} from "@/hooks/useResource";
import styles from "../AdminForm.module.css";

export default function LiveEditForm({ id }) {
  const router = useRouter();

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: liveItem, loading, error } = useResourceItem("live", id);
  const { update, loading: updating } = useUpdateResource("live");
  const { remove, loading: deleting } = useDeleteResource("live");

  useEffect(() => {
    if (!liveItem) {
      return;
    }

    setTitleKo(liveItem.title_ko ?? "");
    setTitleEn(liveItem.title_en ?? "");
    setSpaceKo(liveItem.space_ko ?? "");
    setSpaceEn(liveItem.space_en ?? "");
    setStartAt(liveItem.start_at ?? "");
    setEndAt(liveItem.end_at ?? "");
    setLinkUrl(liveItem.link_url ?? "");
  }, [liveItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
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
    } catch (err) {
      setSubmitError(err.message ?? "Live 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 live 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Live 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!liveItem) {
    return <p className={styles.error}>Live를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live 수정</h1>
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
