// src/components/ui/theme/ThemeProvider.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { TimeTheme } from "./useTheme";

const getTimeBasedTheme = (): TimeTheme => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return "morning";
  if (hour >= 17 && hour < 21) return "sunset";
  return "night";
};

interface ThemeContextType {
  theme: TimeTheme;
  currentHour: number;
  changeTheme: (t: TimeTheme) => void;
  resetToAuto: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<TimeTheme>(() => {
    const saved = localStorage.getItem("theme") as TimeTheme | null;
    const valid: TimeTheme[] = ["morning", "sunset", "night"];
    return saved && valid.includes(saved) ? saved : getTimeBasedTheme();
  });
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const updateHour = () => setCurrentHour(new Date().getHours());
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
    const timeout = setTimeout(() => {
      updateHour();
      const interval = setInterval(updateHour, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilNextHour);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: TimeTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const resetToAuto = () => {
    setTheme(getTimeBasedTheme());
    localStorage.removeItem("theme");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, currentHour, changeTheme, resetToAuto }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};
