"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import {
  detectInitialLocale,
  persistLocale,
} from "@/lib/locale/detectLocale";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    persistLocale(locale);
    document.documentElement.lang = locale;
  }, [locale, ready]);

  function setLocale(nextLocale) {
    setLocaleState(nextLocale);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, ready }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }

  return context;
}
