"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import { useCreateProject } from "@/hooks/project";
import { parseGalleryJson, saveEditorContent } from "./formUtils";
import styles from "../AdminForm.module.css";

export default function ProjectCreateForm() {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [gallery, setGallery] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateProject();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        gallery: parseGalleryJson(gallery),
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      if (error instanceof SyntaxError) {
        setSubmitError("gallery JSON 형식이 올바르지 않습니다.");
        return;
      }

      setSubmitError(error.message ?? "Project 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Project 생성</h1>
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

        <div className={styles.field}>
          content_ko
          <Editor ref={contentKoRef} holderId="editor-project-content-ko" />
        </div>

        <div className={styles.field}>
          content_en
          <Editor ref={contentEnRef} holderId="editor-project-content-en" />
        </div>

        <div className={styles.field}>
          credit_ko
          <Editor ref={creditKoRef} holderId="editor-project-credit-ko" />
        </div>

        <div className={styles.field}>
          credit_en
          <Editor ref={creditEnRef} holderId="editor-project-credit-en" />
        </div>

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

        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "저장 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
