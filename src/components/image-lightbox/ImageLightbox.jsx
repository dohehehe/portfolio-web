"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ImageLightbox.module.css";

const HOVER_SCALE = 2.5;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ImageLightbox({
  isOpen,
  items,
  index,
  onClose,
  onPrev,
  onNext,
}) {
  const closeButtonRef = useRef(null);
  const hitAreaRef = useRef(null);
  const [hover, setHover] = useState({ active: false, x: 50, y: 50 });

  const currentItem = items[index];
  const hasMultipleItems = items.length > 1;
  const canGoPrev = hasMultipleItems && index > 0;
  const canGoNext = hasMultipleItems && index < items.length - 1;

  useEffect(() => {
    setHover({ active: false, x: 50, y: 50 });
  }, [index, isOpen]);

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

  function handleHitAreaMouseMove(event) {
    const hitArea = hitAreaRef.current;

    if (!hitArea) {
      return;
    }

    const rect = hitArea.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    setHover({
      active: true,
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    });
  }

  function handleHitAreaMouseLeave() {
    setHover((prev) => ({ ...prev, active: false }));
  }

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
        <div className={styles.viewport}>
          <div
            ref={hitAreaRef}
            className={styles.hitArea}
            onMouseMove={handleHitAreaMouseMove}
            onMouseLeave={handleHitAreaMouseLeave}
          >
            <img
              className={`${styles.image} ${hover.active ? styles.imageZoomed : ""}`}
              src={currentItem.src}
              alt={currentItem.alt || ""}
              draggable={false}
              style={{
                transformOrigin: `${hover.x}% ${hover.y}%`,
                "--hover-scale": HOVER_SCALE,
              }}
            />
          </div>
        </div>

        {currentItem.caption ? (
          <p className={styles.caption}>{currentItem.caption}</p>
        ) : null}
      </div>
    </div>
  );
}
