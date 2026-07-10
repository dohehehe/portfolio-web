"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";

const LocaleContext = createContext(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
