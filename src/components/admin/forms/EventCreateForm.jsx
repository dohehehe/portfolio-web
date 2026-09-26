"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "@/components/editor/EditorInputClient";
import { useCreateResource } from "@/hooks/useResource";
import GalleryInput from "./GalleryInput";
import { saveEditorContent, serializeGallery } from "./formUtils";
import styles from "../AdminForm.module.css";


export default function EventCreateForm() {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);
  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [date, setDate] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [gallery, setGallery] = useState([]);
  const [fileLink, setFileLink] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [fileLinkUploading, setFileLinkUploading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { create, loading } = useCreateResource("event");

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
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        link_url: linkUrl.trim() || null,
        gallery: serializeGallery(gallery),
        file_link: serializeGallery(fileLink),
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
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

        <GalleryInput
          value={gallery}
          onChange={setGallery}
          onUploadingChange={setGalleryUploading}
        />

        <div className={styles.field}>
          content_ko
          <Editor
            ref={contentKoRef}
            holderId="editor-event-content-ko"
            preview="event-content"
          />
        </div>

        <div className={styles.field}>
          content_en
          <Editor
            ref={contentEnRef}
            holderId="editor-event-content-en"
            preview="event-content"
          />
        </div>

        <div className={styles.field}>
          credit_ko
          <Editor
            ref={creditKoRef}
            holderId="editor-event-credit-ko"
            preview="event-credit"
          />
        </div>

        <div className={styles.field}>
          credit_en
          <Editor
            ref={creditEnRef}
            holderId="editor-event-credit-en"
            preview="event-credit"
          />
        </div>

        <label className={styles.label}>
          link_url
          <input
            className={styles.input}
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
          />
        </label>

        <GalleryInput
          label="file_link"
          imagesOnly
          value={fileLink}
          onChange={setFileLink}
          onUploadingChange={setFileLinkUploading}
        />

        {submitError ? <p className={styles.error}>{submitError}</p> : null}

        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading || galleryUploading || fileLinkUploading}
        >
          {loading ? "저장 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
