"use client";

import { useEffect, useRef } from "react";
import styles from "./ImageLightbox.module.css";

export default function ImageLightbox({
  isOpen,
  items,
  index,
  onClose,
  onPrev,
  onNext,
}) {
  const closeButtonRef = useRef(null);
  const currentItem = items[index];
  const hasMultipleItems = items.length > 1;
  const canGoPrev = hasMultipleItems && index > 0;
  const canGoNext = hasMultipleItems && index < items.length - 1;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && canGoPrev) {
        onPrev();
        return;
      }

      if (event.key === "ArrowRight" && canGoNext) {
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, canGoPrev, canGoNext, onClose, onPrev, onNext]);

  if (!isOpen || !currentItem) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        aria-label="Close image preview"
        onClick={onClose}
      >
        ×
      </button>

      {hasMultipleItems ? (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            aria-label="Previous image"
            disabled={!canGoPrev}
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
          >
            ‹
          </button>

          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            aria-label="Next image"
            disabled={!canGoNext}
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
          >
            ›
          </button>
        </>
      ) : null}

      <div
        className={styles.content}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          className={styles.image}
          src={currentItem.src}
          alt={currentItem.alt || ""}
          draggable={false}
        />

        {currentItem.caption ? (
          <p className={styles.caption}>{currentItem.caption}</p>
        ) : null}
      </div>
    </div>
  );
}
