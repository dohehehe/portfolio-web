"use client";

import { useEffect, useState } from "react";
import GalleryMuxVideo from "@/components/work/gallery/GalleryMuxVideo";
import { getMuxPlaybackId } from "@/components/work/gallery/galleryUtils";
import { useImageUpload } from "@/hooks/useImageUpload";
import styles from "./GalleryInput.module.css";

function createEmptyVideoItem() {
  return {
    img_url: "",
    video_url: "",
    caption_ko: "",
    caption_en: "",
  };
}

function isImageItem(item) {
  return Boolean(item?.img_url);
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

export default function GalleryInput({
  value = [],
  onChange,
  disabled = false,
  onUploadingChange,
}) {
  const [uploadError, setUploadError] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const { uploadImageToServer } = useImageUpload();

  const uploading = uploadingCount > 0;
  const isDisabled = disabled || uploading;

  useEffect(() => {
    onUploadingChange?.(uploadingCount > 0);
  }, [uploadingCount, onUploadingChange]);

  function setUploading(nextUploading) {
    setUploadingCount((count) =>
      nextUploading ? count + 1 : Math.max(0, count - 1),
    );
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
        const result = await uploadImageToServer(file);

        if (!result.success) {
          setUploadError(result.error ?? "이미지 업로드에 실패했습니다.");
          continue;
        }

        uploadedItems.push({
          img_url: result.file.url,
          video_url: "",
          caption_ko: "",
          caption_en: "",
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

  function addVideoItem() {
    onChange([...value, createEmptyVideoItem()]);
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
        <span className={styles.label}>gallery</span>

        <div className={styles.uploadRow}>
          <label className={styles.fileLabel}>
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              multiple
              disabled={isDisabled}
              onChange={handleFiles}
            />
            {uploading ? "업로드 중..." : "이미지 추가"}
          </label>

          <button
            className={styles.addButton}
            type="button"
            disabled={isDisabled}
            onClick={addVideoItem}
          >
            비디오 추가
          </button>
        </div>
      </div>

      {uploadError ? <p className={styles.error}>{uploadError}</p> : null}

      {!value.length ? (
        <p className={styles.empty}>
          이미지 또는 비디오를 추가하면 gallery가 생성됩니다.
        </p>
      ) : (
        <ul className={styles.list}>
          {value.map((item, index) => {
            const imageItem = isImageItem(item);

            return (
            <li
              key={`${item.video_url || item.img_url || "item"}-${index}`}
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
                {imageItem ? (
                  <img
                    className={styles.previewImage}
                    src={item.img_url}
                    alt=""
                  />
                ) : getMuxPlaybackId(item.video_url) ? (
                  <GalleryMuxVideo
                    videoUrl={item.video_url}
                    variant="preview"
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>Mux ID</div>
                )}
              </div>

              <div className={styles.fields}>
                {imageItem ? (
                  <>
                    <label className={styles.captionLabel}>
                      caption_ko
                      <input
                        className={styles.captionInput}
                        type="text"
                        value={item.caption_ko ?? ""}
                        disabled={isDisabled}
                        onChange={(event) =>
                          updateItem(index, { caption_ko: event.target.value })
                        }
                      />
                    </label>

                    <label className={styles.captionLabel}>
                      caption_en
                      <input
                        className={styles.captionInput}
                        type="text"
                        value={item.caption_en ?? ""}
                        disabled={isDisabled}
                        onChange={(event) =>
                          updateItem(index, { caption_en: event.target.value })
                        }
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className={styles.captionLabel}>
                      Mux playback ID
                      <input
                        className={styles.captionInput}
                        type="text"
                        value={item.video_url ?? ""}
                        disabled={isDisabled}
                        placeholder="playback ID"
                        onChange={(event) =>
                          updateItem(index, { video_url: event.target.value.trim() })
                        }
                      />
                    </label>

                    <label className={styles.captionLabel}>
                      caption_ko
                      <input
                        className={styles.captionInput}
                        type="text"
                        value={item.caption_ko ?? ""}
                        disabled={isDisabled}
                        onChange={(event) =>
                          updateItem(index, { caption_ko: event.target.value })
                        }
                      />
                    </label>

                    <label className={styles.captionLabel}>
                      caption_en
                      <input
                        className={styles.captionInput}
                        type="text"
                        value={item.caption_en ?? ""}
                        disabled={isDisabled}
                        onChange={(event) =>
                          updateItem(index, { caption_en: event.target.value })
                        }
                      />
                    </label>
                  </>
                )}
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
