"use client";

import { useAppSettings } from "@/components/providers/app-providers";
import { locales, themes } from "@/lib/translations";

export function LanguageSwitcher() {
  const { locale, setLocale } = useAppSettings();

  return (
    <div className="selector-cluster">
      {locales.map((item) => (
        <button
          key={item}
          className={`selector-pill${locale === item ? " active" : ""}`}
          onClick={() => setLocale(item)}
          type="button"
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useAppSettings();

  return (
    <div className="selector-cluster">
      {themes.map((item) => (
        <button
          key={item}
          className={`selector-pill${theme === item ? " active" : ""}`}
          onClick={() => setTheme(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
