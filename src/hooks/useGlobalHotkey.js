import { useHotkeys } from "react-hotkeys-hook";

export const useSearchFocusHotkey = () => {
  const handler = () => {
    const element = document.querySelector(".sui-search-box__text-input");
    if (element) {
      element.focus();
    }
  };

  return useHotkeys("/", handler);
};
