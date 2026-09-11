"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/admin/EditorClient";
import {
  useDeleteResource,
  useResourceItem,
  useUpdateResource,
} from "@/hooks/useResource";
import GalleryInput from "./GalleryInput";
import {
  normalizeGallery,
  saveEditorContent,
  serializeGallery,
} from "./formUtils";
import styles from "../AdminForm.module.css";


export default function EventEditForm({ id }) {
  const router = useRouter();
  const contentKoRef = useRef(null);
  const contentEnRef = useRef(null);
  const creditKoRef = useRef(null);
  const creditEnRef = useRef(null);
  const noteKrRef = useRef(null);
  const noteEnRef = useRef(null);

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [date, setDate] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [gallery, setGallery] = useState([]);
  const [fileLink, setFileLink] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [fileLinkUploading, setFileLinkUploading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: eventItem, loading, error } = useResourceItem("event", id);
  const { update, loading: updating } = useUpdateResource("event");
  const { remove, loading: deleting } = useDeleteResource("event");

  useEffect(() => {
    if (!eventItem) {
      return;
    }

    setTitleKo(eventItem.title_ko ?? "");
    setTitleEn(eventItem.title_en ?? "");
    setDate(eventItem.date ?? "");
    setSpaceKo(eventItem.space_ko ?? "");
    setSpaceEn(eventItem.space_en ?? "");
    setGallery(normalizeGallery(eventItem.gallery));
    setFileLink(normalizeGallery(eventItem.file_link));
  }, [eventItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        date: date.trim() || null,
        space_ko: spaceKo.trim() || null,
        space_en: spaceEn.trim() || null,
        content_ko: await saveEditorContent(contentKoRef, "content_ko"),
        content_en: await saveEditorContent(contentEnRef, "content_en"),
        credit_ko: await saveEditorContent(creditKoRef, "credit_ko"),
        credit_en: await saveEditorContent(creditEnRef, "credit_en"),
        note_kr: await saveEditorContent(noteKrRef, "note_kr"),
        note_en: await saveEditorContent(noteEnRef, "note_en"),
        gallery: serializeGallery(gallery),
        file_link: serializeGallery(fileLink),
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Event 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 event 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "Event 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!eventItem) {
    return <p className={styles.error}>Event를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting || galleryUploading || fileLinkUploading;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Event 수정</h1>
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
          disabled={saving}
          onUploadingChange={setGalleryUploading}
        />

        <div key={eventItem.id}>
          <div className={styles.field}>
            content_ko
            <Editor
              ref={contentKoRef}
              holderId="editor-event-content-ko"
              data={eventItem.content_ko}
            />
          </div>

          <div className={styles.field}>
            content_en
            <Editor
              ref={contentEnRef}
              holderId="editor-event-content-en"
              data={eventItem.content_en}
            />
          </div>

          <div className={styles.field}>
            credit_ko
            <Editor
              ref={creditKoRef}
              holderId="editor-event-credit-ko"
              data={eventItem.credit_ko}
            />
          </div>

          <div className={styles.field}>
            credit_en
            <Editor
              ref={creditEnRef}
              holderId="editor-event-credit-en"
              data={eventItem.credit_en}
            />
          </div>

          <div className={styles.field}>
            note_kr
            <Editor
              ref={noteKrRef}
              holderId="editor-event-note-kr"
              data={eventItem.note_kr}
            />
          </div>

          <div className={styles.field}>
            note_en
            <Editor
              ref={noteEnRef}
              holderId="editor-event-note-en"
              data={eventItem.note_en}
            />
          </div>
        </div>

        <GalleryInput
          label="file_link"
          imagesOnly
          value={fileLink}
          onChange={setFileLink}
          disabled={saving}
          onUploadingChange={setFileLinkUploading}
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
