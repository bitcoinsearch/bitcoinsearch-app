import { useState, useEffect } from "react";
import tailwindConfig from "../../tailwind.config";

const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

type Breakpoints = typeof breakpoints;

export function useTailwindBreakpoint<T extends keyof Breakpoints>(
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
