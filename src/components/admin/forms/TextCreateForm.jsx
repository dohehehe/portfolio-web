"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import { useCreateText } from "@/hooks/text";
import ForeignSelect from "./ForeignSelect";
import { saveEditorContent } from "./formUtils";
import styles from "../AdminForm.module.css";


export default function TextCreateForm() {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [writerKo, setWriterKo] = useState("");
  const [writerEn, setWriterEn] = useState("");
  const [projectId, setProjectId] = useState("");
  const [eventId, setEventId] = useState("");
  const [workId, setWorkId] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateText();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        writer_ko: writerKo.trim() || null,
        writer_en: writerEn.trim() || null,
        project_id: projectId || null,
        event_id: eventId || null,
        work_id: workId || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setSubmitError(error.message ?? "Text 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Text 생성</h1>
          <p className={styles.description}>text 테이블</p>
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
          writer_ko
          <input
            className={styles.input}
            type="text"
            value={writerKo}
            onChange={(event) => setWriterKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          writer_en
          <input
            className={styles.input}
            type="text"
            value={writerEn}
            onChange={(event) => setWriterEn(event.target.value)}
          />
        </label>

        <div className={styles.field}>
          content_ko
          <Editor ref={contentKoRef} holderId="editor-text-content-ko" />
        </div>

        <div className={styles.field}>
          content_en
          <Editor ref={contentEnRef} holderId="editor-text-content-en" />
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
          event_id
          <ForeignSelect
            foreignTable="event"
            labelKey="title_ko"
            value={eventId}
            onChange={setEventId}
          />
        </label>

        <label className={styles.label}>
          work_id
          <ForeignSelect
            foreignTable="work"
            labelKey="title_ko"
            value={workId}
            onChange={setWorkId}
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
