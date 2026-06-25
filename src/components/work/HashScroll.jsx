"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSectionHash, scrollToSection } from "@/lib/scroll/scrollToSection";

export default function HashScroll({ targetId = null, projectId = null }) {
  const pathname = usePathname();

  useEffect(() => {
    const hashTarget = getSectionHash();
    const id = hashTarget || targetId;

    if (!id) {
      return;
    }

    if (!hashTarget && targetId && projectId) {
      window.history.replaceState(null, "", `/work/${projectId}#${targetId}`);
    }

    const frame = requestAnimationFrame(() => {
      scrollToSection(id, hashTarget ? "smooth" : "instant");
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, targetId, projectId]);

  useEffect(() => {
    function handleHashChange() {
      scrollToSection(getSectionHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
