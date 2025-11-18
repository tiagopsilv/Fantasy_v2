// src/components/ui/theme-provider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextValue {
  /** Valor escolhido pelo usuário: light | dark | system */
  theme: Theme;
  /** Valor realmente aplicado: light | dark (já resolvido a partir de system) */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeContextValue | undefined>(
  undefined
);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    defaultTheme === "system" ? getSystemTheme() : defaultTheme
  );

  // Carrega tema salvo + aplica
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(storageKey) as Theme | null;

    const initialTheme = stored ?? defaultTheme;
    const initialResolved =
      initialTheme === "system" ? getSystemTheme() : initialTheme;

    setThemeState(initialTheme);
    setResolvedTheme(initialResolved);
    applyThemeClass(initialResolved);

    // Reagir a mudança de tema do sistema quando estiver em "system"
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (initialTheme === "system") {
        const sys = getSystemTheme();
        setResolvedTheme(sys);
        applyThemeClass(sys);
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [defaultTheme, storageKey]);

  const setTheme = (t: Theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, t);
    }
    setThemeState(t);
    const newResolved = t === "system" ? getSystemTheme() : t;
    setResolvedTheme(newResolved);
    applyThemeClass(newResolved);
  };

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  }
  return ctx;
}
