import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "system" | "dark" | "light";

type ThemeState = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  effective: "light" | "dark";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (m: ThemeMode) => {
        set({ mode: m });
        const preferDark =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const effective =
          m === "system"
            ? preferDark
              ? "dark"
              : "light"
            : m === "dark"
            ? "dark"
            : "light";
        if (typeof document !== "undefined") {
          if (effective === "dark")
            document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        }
      },
      effective:
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
