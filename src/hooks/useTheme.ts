import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const themeKey = "theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const storedThemePreference = localStorage.getItem(themeKey) as Theme;
    return (
      storedThemePreference ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");

    localStorage.setItem(themeKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme] as const;
}
