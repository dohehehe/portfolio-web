"use client";

import { useEffect, useRef, useState } from "react";
import EventEditor from "./EventEditor";
import styles from "./EventNoteModal.module.css";

export default function EventNoteModal({ data }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef(null);

  function open() {
    setIsMounted(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }

  function close() {
    setIsVisible(false);
  }

  function handleTransitionEnd(event) {
    if (event.target !== event.currentTarget || isVisible) {
      return;
    }

    setIsMounted(false);
  }

  useEffect(() => {
    if (!isMounted) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const previousBodyOverflow = bodyStyle.overflow;
    const previousHtmlOverflow = htmlStyle.overflow;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;
    const previousBodyPaddingRight = bodyStyle.paddingRight;

    bodyStyle.overflow = "hidden";
    htmlStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      bodyStyle.overflow = previousBodyOverflow;
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      bodyStyle.paddingRight = previousBodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsVisible(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  if (!data) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Open note"
        aria-expanded={isVisible}
        onClick={open}
      >
        (...)
      </button>

      {isMounted ? (
        <div
          className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ""}`.trim()}
          role="dialog"
          aria-modal="true"
          aria-label="Event note"
          onClick={close}
          onTransitionEnd={handleTransitionEnd}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            aria-label="Close note"
            onClick={close}
          >
            ×
          </button>

          <div
            className={styles.panel}
            onClick={(event) => event.stopPropagation()}
          >
            <EventEditor data={data} variant="note" />
          </div>
        </div>
      ) : null}
    </>
  );
}
