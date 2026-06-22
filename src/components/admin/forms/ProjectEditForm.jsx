"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "@/hooks/project";
import GalleryInput from "./GalleryInput";
import { normalizeGallery, saveEditorContent, serializeGallery } from "./formUtils";
import styles from "../AdminForm.module.css";

export default function ProjectEditForm({ id }) {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: project, loading, error } = useProject(id);
  const { update, loading: updating } = useUpdateProject();
  const { remove, loading: deleting } = useDeleteProject();

  useEffect(() => {
    if (!project) {
      return;
    }

    setTitleKo(project.title_ko ?? "");
    setTitleEn(project.title_en ?? "");
    setYear(project.year ?? "");
    setGallery(normalizeGallery(project.gallery));
  }, [project]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        gallery: serializeGallery(gallery),
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Project 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 project 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Project 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!project) {
    return <p className={styles.error}>Project를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting || galleryUploading;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Project 수정</h1>
          <p className={styles.description}>project 테이블</p>
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

        <div key={project.id}>
          <div className={styles.field}>
            content_ko
            <Editor
              ref={contentKoRef}
              holderId="editor-project-content-ko"
              data={project.content_ko}
            />
          </div>

          <div className={styles.field}>
            content_en
            <Editor
              ref={contentEnRef}
              holderId="editor-project-content-en"
              data={project.content_en}
            />
          </div>

          <div className={styles.field}>
            credit_ko
            <Editor
              ref={creditKoRef}
              holderId="editor-project-credit-ko"
              data={project.credit_ko}
            />
          </div>

          <div className={styles.field}>
            credit_en
            <Editor
              ref={creditEnRef}
              holderId="editor-project-credit-en"
              data={project.credit_en}
            />
          </div>
        </div>

        <GalleryInput
          value={gallery}
          onChange={setGallery}
          disabled={saving}
          onUploadingChange={setGalleryUploading}
        />

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
