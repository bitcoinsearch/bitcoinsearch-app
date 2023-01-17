import { useEffect } from "react";

const useGlobalHotkey = ({ callback = () => {}, hotkeys }) => {
  useEffect(() => {
    const hotkeyHandler = (e) => {
      const isBody = e.target.localName === "body";

      if (isBody) {
        const isKey = hotkeys.find((keyConfig) => keyConfig.key === e.key);
        if (isKey && isKey.elementIdentifier) {
          const element = document.querySelector(isKey.elementIdentifier);
          e.preventDefault();
          element && isKey.callback(element);
        }
      }
    };

    document.body.addEventListener("keydown", hotkeyHandler);

    return () => {
      document.body.removeEventListener("keydown", hotkeyHandler);
    };
  }, [callback, hotkeys]);
};

export default useGlobalHotkey;
