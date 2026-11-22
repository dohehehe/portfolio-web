"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAVIGATION_START_EVENT } from "@/lib/loading/navigationProgress";
import styles from "./LoadingBar.module.css";

const SHOW_DELAY_MS = 60;
const COMPLETE_MS = 180;
const FADE_MS = 160;
const SAFETY_MS = 10000;

export default function LoadingBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const barRef = useRef(null);
  const pathnameRef = useRef(pathname);
  const activeRef = useRef(false);
  const shownRef = useRef(false);
  const generationRef = useRef(0);
  const frameRef = useRef(0);
  const showTimerRef = useRef(0);
  const safetyTimerRef = useRef(0);
  const hideTimerRef = useRef(0);
  const resetTimerRef = useRef(0);
  const finishRef = useRef(() => {});

  useEffect(() => {
    function setScale(value) {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${value})`;
      }
    }

    function clearTimer(timerRef) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    }

    function stopFrame() {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    }

    function finish(generation) {
      if (!activeRef.current || generation !== generationRef.current) {
        return;
      }

      activeRef.current = false;
      stopFrame();
      clearTimer(showTimerRef);
      clearTimer(safetyTimerRef);

      if (!shownRef.current) {
        setVisible(false);
        setFinishing(false);
        setScale(0);
        return;
      }

      setFinishing(true);
      setVisible(true);
      frameRef.current = requestAnimationFrame(() => {
        setScale(1);
      });

      clearTimer(hideTimerRef);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        clearTimer(resetTimerRef);
        resetTimerRef.current = window.setTimeout(() => {
          shownRef.current = false;
          setFinishing(false);
          setScale(0);
        }, FADE_MS);
      }, COMPLETE_MS);
    }

    finishRef.current = () => {
      finish(generationRef.current);
    };

    function start() {
      const generation = generationRef.current + 1;
      generationRef.current = generation;
      activeRef.current = true;
      shownRef.current = false;

      stopFrame();
      clearTimer(showTimerRef);
      clearTimer(safetyTimerRef);
      clearTimer(hideTimerRef);
      clearTimer(resetTimerRef);

      setFinishing(false);
      setVisible(false);
      setScale(0);

      const startedAt = performance.now();

      function tick(now) {
        if (!activeRef.current || generation !== generationRef.current) {
          return;
        }

        const elapsed = now - startedAt;
        const next = 1 - Math.exp(-elapsed / 700);
        setScale(Math.min(next, 0.92));
        frameRef.current = requestAnimationFrame(tick);
      }

      frameRef.current = requestAnimationFrame(tick);

      showTimerRef.current = window.setTimeout(() => {
        if (!activeRef.current || generation !== generationRef.current) {
          return;
        }

        shownRef.current = true;
        setVisible(true);
      }, SHOW_DELAY_MS);

      safetyTimerRef.current = window.setTimeout(() => {
        finish(generation);
      }, SAFETY_MS);
    }

    function onClick(event) {
      if (event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target instanceof Element ? event.target.closest("a") : null;

      if (!anchor || anchor.hasAttribute("download")) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      let nextUrl;

      try {
        nextUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      if (
        nextUrl.pathname === window.location.pathname &&
        nextUrl.search === window.location.search
      ) {
        return;
      }

      start();
    }

    function onPopState() {
      if (window.location.pathname !== pathnameRef.current) {
        start();
      }
    }

    window.addEventListener(NAVIGATION_START_EVENT, start);
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, start);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      activeRef.current = false;
      stopFrame();
      clearTimer(showTimerRef);
      clearTimer(safetyTimerRef);
      clearTimer(hideTimerRef);
      clearTimer(resetTimerRef);
    };
  }, []);

  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;
    finishRef.current();
  }, [pathname]);

  return (
    <div
      className={`${styles.track} ${visible ? styles.visible : ""} ${finishing ? styles.finishing : ""}`.trim()}
      role="progressbar"
      aria-hidden={visible ? undefined : true}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading"
    >
      <div ref={barRef} className={styles.bar} />
    </div>
  );
}
