import type { ReactNode } from "react";

import { ConfigProvider, Segmented, theme } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "dark" | "light" | "system";

const STORAGE_KEY = "admin:theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const PRIMARY = "#2f6b4f";

const DARK_PRIMARY = "#4fa37b";

type ThemeModeValue = {
  dark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeValue>({
  dark: false,
  mode: "system",
  setMode: () => {},
});

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredThemeMode);
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    systemPrefersDark,
    () => false,
  );
  const dark = mode === "dark" || (mode === "system" && systemDark);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "light";
    root.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  const value = useMemo<ThemeModeValue>(
    () => ({
      dark,
      mode,
      setMode: (next) => {
        storeThemeMode(next);
        setModeState(next);
      },
    }),
    [dark, mode],
  );

  return (
    <ThemeModeContext value={value}>
      <ConfigProvider
        theme={{
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: { colorPrimary: dark ? DARK_PRIMARY : PRIMARY },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeModeContext>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

function darkQuery() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(DARK_QUERY)
    : null;
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light" || value === "system";
}

function readStoredThemeMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function storeThemeMode(mode: ThemeMode) {
  try {
    if (mode === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    return;
  }
}

function subscribeSystemDark(onChange: () => void) {
  const query = darkQuery();
  query?.addEventListener("change", onChange);
  return () => query?.removeEventListener("change", onChange);
}

function systemPrefersDark() {
  return darkQuery()?.matches ?? false;
}

const OPTIONS: Array<{ label: string; value: ThemeMode }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Auto", value: "system" },
];

export function ThemeModeSwitch() {
  const { mode, setMode } = useThemeMode();
  return (
    <Segmented<ThemeMode>
      aria-label="Theme"
      onChange={setMode}
      options={OPTIONS}
      size="small"
      value={mode}
    />
  );
}
