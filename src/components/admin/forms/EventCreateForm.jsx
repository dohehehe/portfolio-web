"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import { useCreateEvent } from "@/hooks/event";
import { parseGalleryJson, saveEditorContent } from "./formUtils";
import styles from "../AdminForm.module.css";


export default function EventCreateForm() {
  const router = useRouter();
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [date, setDate] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [gallery, setGallery] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateEvent();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await create({
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        date: date.trim() || null,
        space_ko: spaceKo.trim() || null,
        space_en: spaceEn.trim() || null,
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

      setSubmitError(error.message ?? "Event 생성에 실패했습니다.");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Event 생성</h1>
          <p className={styles.description}>event 테이블</p>
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
          date
          <input
            className={styles.input}
            type="text"
            value={date}
            onChange={(event) => setDate(event.target.value)}
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
          gallery (JSON)
          <textarea
            className={styles.jsonTextarea}
            value={gallery}
            onChange={(event) => setGallery(event.target.value)}
            placeholder='예: ["image-url-1", "image-url-2"]'
          />
        </label>

        <div className={styles.field}>
          credit_ko
          <Editor ref={creditKoRef} holderId="editor-event-credit-ko" />
        </div>

        <div className={styles.field}>
          credit_en
          <Editor ref={creditEnRef} holderId="editor-event-credit-en" />
        </div>

        {submitError ? <p className={styles.error}>{submitError}</p> : null}

        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "저장 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
