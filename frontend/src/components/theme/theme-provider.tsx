"use client";
import { useThemeStore } from "@/store/themeStore";
import { ReactNode, useEffect } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;

      if (mode === "system") {
        const systemTheme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (systemTheme) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      } else {
        if (mode === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    applyTheme();

    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mode, setMode]);

  return <>{children}</>;
}
