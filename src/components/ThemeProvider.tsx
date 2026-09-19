"use client";

import { useEffect } from "react";

const PREFS_STORAGE_KEY = "app_preferences";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to apply the theme to document
    const applyTheme = () => {
      try {
        const savedPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          if (prefs.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (e) {
        console.error("Failed to parse theme preferences", e);
      }
    };

    // Apply on mount
    applyTheme();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PREFS_STORAGE_KEY) {
        applyTheme();
      }
    };

    const handleLocalThemeUpdate = () => {
      applyTheme();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("theme-updated", handleLocalThemeUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("theme-updated", handleLocalThemeUpdate);
    };
  }, []);

  return <>{children}</>;
}
