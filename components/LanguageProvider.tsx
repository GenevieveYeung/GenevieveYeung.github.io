"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localeLabels, localeNames, type Locale, ui } from "@/data/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: (typeof ui)[Locale];
  label: (typeof localeLabels)[Locale];
  name: (typeof localeNames)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "zh-CN" || value === "zh-HK";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-locale");
    if (isLocale(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    window.localStorage.setItem("portfolio-locale", locale);
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => setLocaleState(next),
    copy: ui[locale],
    label: localeLabels[locale],
    name: localeNames[locale],
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageProvider;

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export { localeLabels, localeNames };
