"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadStudioSettings, patchStudioSettings, seedWorkspace } from "@/lib/project-storage";
import { translations, type Locale, type ThemeName } from "@/lib/translations";

type AppSettingsContextValue = {
  locale: Locale;
  setLocale: (value: Locale) => void;
  theme: ThemeName;
  setTheme: (value: ThemeName) => void;
  hydrated: boolean;
  t: (typeof translations)[Locale];
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppProviders({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      seedWorkspace();
      const settings = loadStudioSettings();
      setLocale(settings.language);
      setTheme(settings.theme);
      setHydrated(true);
    };

    queueMicrotask(hydrate);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    patchStudioSettings({ language: locale, theme });
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
  }, [hydrated, locale, theme]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      locale,
      setLocale,
      theme,
      setTheme,
      hydrated,
      t: translations[locale],
    }),
    [hydrated, locale, theme],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used inside AppProviders.");
  }

  return context;
}