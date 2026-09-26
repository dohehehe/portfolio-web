"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/editor/EditorInputClient";
import {
  useDeleteResource,
  useResourceItem,
  useUpdateResource,
} from "@/hooks/useResource";
import ForeignSelect from "./ForeignSelect";
import { saveEditorContent } from "./formUtils";
import styles from "../AdminForm.module.css";


export default function TextEditForm({ id }) {
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
  const [typeId, setTypeId] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: textItem, loading, error } = useResourceItem("text", id);
  const { update, loading: updating } = useUpdateResource("text");
  const { remove, loading: deleting } = useDeleteResource("text");

  useEffect(() => {
    if (!textItem) {
      return;
    }

    setTitleKo(textItem.title_ko ?? "");
    setTitleEn(textItem.title_en ?? "");
    setYear(textItem.year ?? "");
    setWriterKo(textItem.writer_ko ?? "");
    setWriterEn(textItem.writer_en ?? "");
    setProjectId(textItem.project_id ?? "");
    setEventId(textItem.event_id ?? "");
    setWorkId(textItem.work_id ?? "");
    setTypeId(textItem.type_id ?? "");
  }, [textItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        year: year.trim() || null,
        writer_ko: writerKo.trim() || null,
        writer_en: writerEn.trim() || null,
        project_id: projectId || null,
        event_id: eventId || null,
        work_id: workId || null,
        type_id: typeId || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Text 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 text 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Text 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!textItem) {
    return <p className={styles.error}>Text를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Text 수정</h1>
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

        <label className={styles.label}>
          type_id
          <ForeignSelect
            foreignTable="text_type"
            labelKey="name"
            value={typeId}
            onChange={setTypeId}
          />
        </label>

        <div key={textItem.id}>
          <div className={styles.field}>
            content_ko
            <Editor
              ref={contentKoRef}
              holderId="editor-text-content-ko"
              data={textItem.content_ko}
              preview="text-content"
            />
          </div>

          <div className={styles.field}>
            content_en
            <Editor
              ref={contentEnRef}
              holderId="editor-text-content-en"
              data={textItem.content_en}
              preview="text-content"
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
