import { useHotkeys } from "react-hotkeys-hook";
import { isMac } from "../utils/userOS";

export const useSearchFocusHotkey = () => {
  const handler = (keyEvent, hkEvent) => {
    const isMacDevice = isMac();
    if (isMacDevice) {
      if (!hkEvent.meta && keyEvent.key !== "/") {
        return;
      }
    }

    keyEvent.preventDefault();
    const element = document.querySelector(".sui-search-box__text-input");
    if (element) {
      element.focus();
    }
  };

  return useHotkeys(["/", "ctrl+k", "Meta+k"], (keyEvent, hkEvent) =>
    handler(keyEvent, hkEvent)
  );
};
