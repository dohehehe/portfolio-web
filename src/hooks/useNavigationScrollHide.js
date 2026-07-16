"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_DIRECTION_THRESHOLD = 8;
const ALWAYS_VISIBLE_VH = 0.7;

function getAlwaysVisibleOffset() {
  return window.innerHeight * ALWAYS_VISIBLE_VH;
}

export function useNavigationScrollHide(enabled) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const show = useCallback(() => {
    setIsHidden(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsHidden(false);
      return;
    }

    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= getAlwaysVisibleOffset()) {
        setIsHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollYRef.current;

      if (delta > SCROLL_DIRECTION_THRESHOLD) {
        setIsHidden(true);
      } else if (delta < -SCROLL_DIRECTION_THRESHOLD) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled]);

  return { isHidden, show };
}
