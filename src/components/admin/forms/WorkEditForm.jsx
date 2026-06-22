"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import { useDeleteWork, useUpdateWork, useWork } from "@/hooks/work";
import ForeignSelect from "./ForeignSelect";
import { parseGalleryJson, saveEditorContent } from "./formUtils";
import styles from "../AdminForm.module.css";


export default function WorkEditForm({ id }) {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);

  const [year, setYear] = useState("");
  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [mediumKo, setMediumKo] = useState("");
  const [mediumEn, setMediumEn] = useState("");
  const [dimensionKo, setDimensionKo] = useState("");
  const [dimensionEn, setDimensionEn] = useState("");
  const [projectId, setProjectId] = useState("");
  const [gallery, setGallery] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: work, loading, error } = useWork(id);
  const { update, loading: updating } = useUpdateWork();
  const { remove, loading: deleting } = useDeleteWork();

  useEffect(() => {
    if (!work) {
      return;
    }

    setYear(work.year ?? "");
    setTitleKo(work.title_ko ?? "");
    setTitleEn(work.title_en ?? "");
    setMediumKo(work.medium_ko ?? "");
    setMediumEn(work.medium_en ?? "");
    setDimensionKo(work.dimension_ko ?? "");
    setDimensionEn(work.dimension_en ?? "");
    setProjectId(work.project_id ?? "");
    setGallery(work.gallery ? JSON.stringify(work.gallery, null, 2) : "");
  }, [work]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        year: year.trim() || null,
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        medium_ko: mediumKo.trim() || null,
        medium_en: mediumEn.trim() || null,
        dimension_ko: dimensionKo.trim() || null,
        dimension_en: dimensionEn.trim() || null,
        project_id: projectId || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        gallery: parseGalleryJson(gallery),
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setSubmitError("gallery JSON 형식이 올바르지 않습니다.");
        return;
      }

      setSubmitError(err.message ?? "Work 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 work 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Work 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!work) {
    return <p className={styles.error}>Work를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Work 수정</h1>
          <p className={styles.description}>work 테이블</p>
        </div>
        <Link className={styles.backLink} href="/admin">
          목록으로
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
          medium_ko
          <input
            className={styles.input}
            type="text"
            value={mediumKo}
            onChange={(event) => setMediumKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          medium_en
          <input
            className={styles.input}
            type="text"
            value={mediumEn}
            onChange={(event) => setMediumEn(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          dimension_ko
          <input
            className={styles.input}
            type="text"
            value={dimensionKo}
            onChange={(event) => setDimensionKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          dimension_en
          <input
            className={styles.input}
            type="text"
            value={dimensionEn}
            onChange={(event) => setDimensionEn(event.target.value)}
          />
        </label>

        <div key={work.id}>
          <div className={styles.field}>
            content_ko
            <Editor
              ref={contentKoRef}
              holderId="editor-work-content-ko"
              data={work.content_ko}
            />
          </div>

          <div className={styles.field}>
            content_en
            <Editor
              ref={contentEnRef}
              holderId="editor-work-content-en"
              data={work.content_en}
            />
          </div>

          <div className={styles.field}>
            credit_ko
            <Editor
              ref={creditKoRef}
              holderId="editor-work-credit-ko"
              data={work.credit_ko}
            />
          </div>

          <div className={styles.field}>
            credit_en
            <Editor
              ref={creditEnRef}
              holderId="editor-work-credit-en"
              data={work.credit_en}
            />
          </div>
        </div>

        <label className={styles.label}>
          project_id
          <ForeignSelect
            foreignTable="project"
            labelKey="title_ko"
            value={projectId}
            onChange={setProjectId}
          />
        </label>

        <label className={styles.label}>
          gallery (JSON)
          <textarea
            className={styles.jsonTextarea}
            value={gallery}
            onChange={(event) => setGallery(event.target.value)}
            placeholder='예: ["image-url-1", "image-url-2"]'
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
