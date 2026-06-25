"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { localizedPath } from "@/lib/locale/routing";
import { getSectionHash, scrollToSection } from "@/lib/scroll/scrollToSection";

export default function HashScroll({
  targetId = null,
  projectId = null,
  locale,
}) {
  const pathname = usePathname();

  useEffect(() => {
    const hashTarget = getSectionHash();
    const id = hashTarget || targetId;

    if (!id) {
      return;
    }

    if (!hashTarget && targetId && projectId) {
      const path = localizedPath(`/work/${projectId}`, locale, targetId);
      window.history.replaceState(null, "", path);
    }

    const frame = requestAnimationFrame(() => {
      scrollToSection(id, hashTarget ? "smooth" : "instant");
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, targetId, projectId, locale]);

  useEffect(() => {
    function handleHashChange() {
      scrollToSection(getSectionHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
