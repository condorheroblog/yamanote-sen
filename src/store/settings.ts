import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type Lang = "en" | "jp";

interface SettingsState {
  theme: Theme;
  lang: Lang;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

function detectInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("yamanote-sen.theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: detectInitialTheme(),
      lang: "en",
      setTheme: theme => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setLang: lang => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "en" ? "jp" : "en" }),
    }),
    {
      name: "yamanote-sen.settings",
      partialize: state => ({ theme: state.theme, lang: state.lang }),
    },
  ),
);

// Keep the document root in sync with the theme setting.
export function applyThemeClass(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}
