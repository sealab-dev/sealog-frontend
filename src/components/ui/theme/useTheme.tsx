import { useState, useEffect } from "react";

export type TimeTheme = "morning" | "sunset" | "night";

// 훅 바깥 - 순수 함수만 가능 (Hook 사용 불가)
const getTimeBasedTheme = (): TimeTheme => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return "morning";
  if (hour >= 17 && hour < 21) return "sunset";
  return "night";
};
export const useTheme = () => {
  const [theme, setTheme] = useState<TimeTheme>(getTimeBasedTheme);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // // localStorage에서 theme 불러오기
  // useEffect(() => {
  //   const saved = localStorage.getItem("theme") as TimeTheme | null;
  //   const valid: TimeTheme[] = ["morning", "sunset", "night"];
  //   if (saved && valid.includes(saved)) {
  //     setTheme(saved);
  //   }
  // }, []);

  // 시간 업데이트
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

  // data-theme 적용
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: TimeTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const resetToAuto = () => {
    const autoTheme = getTimeBasedTheme();
    setTheme(autoTheme);
    localStorage.removeItem("theme");
  };

  return { theme, changeTheme, resetToAuto, currentHour };
};
