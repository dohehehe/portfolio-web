"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "@/components/editor/EditorInputClient";
import { useCreateResource } from "@/hooks/useResource";
import GalleryInput from "./GalleryInput";
import { saveEditorContent, serializeGallery } from "./formUtils";
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
  const [mediumKo, setMediumKo] = useState("");
  const [mediumEn, setMediumEn] = useState("");
  const [dimensionKo, setDimensionKo] = useState("");
  const [dimensionEn, setDimensionEn] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateResource("project");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        medium_ko: mediumKo.trim() || null,
        medium_en: mediumEn.trim() || null,
        dimension_ko: dimensionKo.trim() || null,
        dimension_en: dimensionEn.trim() || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        gallery: serializeGallery(gallery),
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
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

        <div className={styles.field}>
          content_ko
          <Editor
            ref={contentKoRef}
            holderId="editor-project-content-ko"
            preview="project-content"
          />
        </div>

        <div className={styles.field}>
          content_en
          <Editor
            ref={contentEnRef}
            holderId="editor-project-content-en"
            preview="project-content"
          />
        </div>

        <div className={styles.field}>
          credit_ko
          <Editor
            ref={creditKoRef}
            holderId="editor-project-credit-ko"
            preview="project-credit"
          />
        </div>

        <div className={styles.field}>
          credit_en
          <Editor
            ref={creditEnRef}
            holderId="editor-project-credit-en"
            preview="project-credit"
          />
        </div>

        <GalleryInput
          value={gallery}
          onChange={setGallery}
          onUploadingChange={setGalleryUploading}
        />

        {submitError ? <p className={styles.error}>{submitError}</p> : null}

        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading || galleryUploading}
        >
          {loading ? "저장 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
