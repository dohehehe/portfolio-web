"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale/routing";

export default function HtmlLocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.lang = getLocaleFromPathname(pathname);
  }, [pathname]);

  return null;
}
