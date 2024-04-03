import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const themeKey = "theme";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>(
  null
);

export function useTheme() {
  const contextValue = useContext(ThemeContext);

  if (!contextValue) {
    throw new Error("Wrap your components tree with a ThemeProvider component");
  }

  return contextValue;
}

export const ThemeProvider = (props: React.PropsWithChildren) => {
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

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
