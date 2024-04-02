import { useEffect, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const resolvedConfig = resolveConfig(tailwindConfig);

type DefaultBreakpoints = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = (() => {
  const object: Record<DefaultBreakpoints, string> = {} as Record<
    string,
    string
  >;

  const screens = resolvedConfig.theme.screens;

  switch (true) {
    case !screens:
    case typeof screens !== "object":
    case typeof screens === "object" && typeof screens === null:
      break;
    default: {
      for (const key of Object.keys(screens)) {
        object[key] = `(min-width: ${screens[key]})`;
      }
    }
  }

  return object;
})();

export function useTailwindBreakpoint<T extends DefaultBreakpoints>(
  breakpoint: T
) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoints[breakpoint]);
    setIsMatch(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [breakpoint]);

  return isMatch;
}
