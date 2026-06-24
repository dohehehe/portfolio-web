"use client";

import { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import styles from "./GalleryInput.module.css";

function createEmptyItem() {
  return {
    file_url: "",
    title_ko: "",
    title_en: "",
  };
}

function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (!moved) {
    return items;
  }

  next.splice(toIndex, 0, moved);
  return next;
}

function getFileName(url) {
  if (!url) {
    return "PDF";
  }

  const pathname = url.split("?")[0];
  const segments = pathname.split("/");
  const filename = segments[segments.length - 1];

  return filename || "PDF";
}

export default function FileLinkInput({
  value = [],
  onChange,
  disabled = false,
  onUploadingChange,
}) {
  const [uploadError, setUploadError] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const { uploadFileToServer } = useFileUpload();

  const uploading = uploadingCount > 0;
  const isDisabled = disabled || uploading;

  function setUploading(nextUploading) {
    setUploadingCount((count) => {
      const nextCount = nextUploading ? count + 1 : Math.max(0, count - 1);
      onUploadingChange?.(nextCount > 0);
      return nextCount;
    });
  }

  function updateItem(index, patch) {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function removeItem(index) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleFiles(event) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const uploadedItems = [];

      for (const file of files) {
        const result = await uploadFileToServer(file);

        if (!result.success) {
          setUploadError(result.error ?? "PDF 업로드에 실패했습니다.");
          continue;
        }

        uploadedItems.push({
          ...createEmptyItem(),
          file_url: result.file.url,
        });
      }

      if (uploadedItems.length) {
        onChange([...value, ...uploadedItems]);
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(event, index) {
    event.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index) {
    if (dragIndex === null) {
      return;
    }

    onChange(moveItem(value, dragIndex, index));
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className={styles.field}>
      <div className={styles.header}>
        <span className={styles.label}>file_link</span>

        <div className={styles.uploadRow}>
          <label className={styles.fileLabel}>
            <input
              className={styles.fileInput}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              disabled={isDisabled}
              onChange={handleFiles}
            />
            {uploading ? "업로드 중..." : "PDF 추가"}
          </label>
        </div>
      </div>

      {uploadError ? <p className={styles.error}>{uploadError}</p> : null}

      {!value.length ? (
        <p className={styles.empty}>PDF를 추가하면 file_link가 생성됩니다.</p>
      ) : (
        <ul className={styles.list}>
          {value.map((item, index) => (
            <li
              key={`${item.file_url}-${index}`}
              className={[
                styles.item,
                dragIndex === index ? styles.itemDragging : "",
                dragOverIndex === index ? styles.itemDragOver : "",
              ]
                .filter(Boolean)
                .join(" ")}
              draggable={!isDisabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            >
              <div className={styles.dragHandle} title="드래그하여 순서 변경">
                ⋮⋮
              </div>

              <div className={styles.previewWrap}>
                {item.file_url ? (
                  <a
                    className={styles.previewLink}
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getFileName(item.file_url)}
                  </a>
                ) : null}
              </div>

              <div className={styles.fields}>
                <label className={styles.captionLabel}>
                  title_ko
                  <input
                    className={styles.captionInput}
                    type="text"
                    value={item.title_ko ?? ""}
                    disabled={isDisabled}
                    onChange={(event) =>
                      updateItem(index, { title_ko: event.target.value })
                    }
                  />
                </label>

                <label className={styles.captionLabel}>
                  title_en
                  <input
                    className={styles.captionInput}
                    type="text"
                    value={item.title_en ?? ""}
                    disabled={isDisabled}
                    onChange={(event) =>
                      updateItem(index, { title_en: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.actionButton}
                  type="button"
                  disabled={isDisabled || index === 0}
                  onClick={() => onChange(moveItem(value, index, index - 1))}
                >
                  위로
                </button>

                <button
                  className={styles.actionButton}
                  type="button"
                  disabled={isDisabled || index === value.length - 1}
                  onClick={() => onChange(moveItem(value, index, index + 1))}
                >
                  아래로
                </button>

                <button
                  className={`${styles.actionButton} ${styles.removeButton}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => removeItem(index)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
