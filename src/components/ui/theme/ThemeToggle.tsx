import { useState } from "react";
import { useThemeContext } from "./ThemeProvider";
import type { TimeTheme } from "./useTheme";
import styles from "./ThemeToggle.module.css";

const THEMES: { value: TimeTheme; label: string; icon: string }[] = [
  { value: "morning", label: "아침", icon: "🌅" },
  { value: "sunset", label: "일몰", icon: "🌇" },
  { value: "night", label: "밤", icon: "🌙" },
];

const CURRENT_ICON: Record<TimeTheme, string> = {
  morning: "🌅",
  sunset: "🌇",
  night: "🌙",
};

export const ThemeToggle = () => {
  const { theme, changeTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.fab}>
      {/* 선택 패널 */}
      {isOpen && (
        <div className={styles.panel}>
          {THEMES.map(({ value, label, icon }) => (
            <button
              key={value}
              className={`${styles.option} ${theme === value ? styles.active : ""}`}
              onClick={() => {
                changeTheme(value);
                setIsOpen(false);
              }}
              aria-label={`${label} 테마`}
            >
              <span className={styles.optionIcon}>{icon}</span>
              <span className={styles.optionLabel}>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="테마 변경"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerIcon}>{CURRENT_ICON[theme]}</span>
      </button>
    </div>
  );
};
