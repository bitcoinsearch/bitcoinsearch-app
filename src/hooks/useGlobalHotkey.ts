import { useHotkeys } from "react-hotkeys-hook";
import { isMac } from "../utils/userOS";
// import useIsMac from "@/hooks/useIsMac";

export const useSearchFocusHotkey = () => {
  const handler = (keyEvent, hkEvent) => {
    const isMacDevice = isMac();
    if (isMacDevice) {
      if (!hkEvent.meta && keyEvent.key !== "/") {
        return;
      }
    }

    keyEvent.preventDefault();
    const element: HTMLElement = document.querySelector(".search-box");
    if (element) {
      element.focus();
    }
  };

  return useHotkeys(["/", "ctrl+k", "Meta+k"], (keyEvent, hkEvent) =>
    handler(keyEvent, hkEvent)
  );
};
