import { useEffect, useRef, useState } from "react";
import { isInViewport } from "../utils/navigation";

const useCheckboxNavigate = (checkboxContainer, searchEl, options) => {
  const checkboxNavIndex = useRef(null);
  const savedNavIndex = useRef(0);
  const [currentNavigateCheckbox, setcurrentNavigateCheckbox] = useState("");

  const refocus = useRef(false);

  const toggleRefocus = () => {
    refocus.current = !refocus.current;
  };

  useEffect(() => {
    const multiCheckboxWrapper = checkboxContainer.current;
    const multiCheckboxList =
      multiCheckboxWrapper && Array.from(multiCheckboxWrapper?.children);
    const searchInput = searchEl.current;
    // focus back to search when options changes
    if (refocus.current) {
      searchInput && searchInput.focus();
      toggleRefocus();
    }

    let currentCheckboxNavIndex = checkboxNavIndex.current;
    setcurrentNavigateCheckbox("");
    const handleOptionNavigation = (e) => {
      const charCode =
        e.keyCode || (typeof e.which === "number" && e.which) || null;

      switch (charCode) {
        case 40:
          // downArrow
          if (currentCheckboxNavIndex === null) {
            currentCheckboxNavIndex = 0;
          } else {
            if (currentCheckboxNavIndex > multiCheckboxList.length - 1) {
              currentCheckboxNavIndex = 0;
            } else {
              currentCheckboxNavIndex += 1;
            }
          }
          break;
        case 38:
          // upArrow
          if (currentCheckboxNavIndex === null) {
            currentCheckboxNavIndex = multiCheckboxList.length - 1;
          } else {
            if (currentCheckboxNavIndex === 0) {
              currentCheckboxNavIndex = multiCheckboxList.length - 1;
            } else {
              currentCheckboxNavIndex -= 1;
            }
          }
          break;
        case 13:
          // Enter
          e.preventDefault();
          if (currentCheckboxNavIndex === null) currentCheckboxNavIndex = 0;
          const input =
            multiCheckboxList[currentCheckboxNavIndex] &&
            multiCheckboxList[currentCheckboxNavIndex].querySelector("input");
          if (input) {
            savedNavIndex.current = currentCheckboxNavIndex;
            input.click();
          }
          break;
        default:
          break;
      }
      const currentLabel = multiCheckboxList[currentCheckboxNavIndex];
      if (currentLabel) {
        const inViewPort = isInViewport(currentLabel);
        !inViewPort &&
          currentLabel.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
      }
      setcurrentNavigateCheckbox(currentLabel?.dataset?.checkbox ?? "");
    };

    searchInput &&
      searchInput.addEventListener("keydown", handleOptionNavigation);

    return () => {
      searchInput &&
        searchInput.removeEventListener("keydown", handleOptionNavigation);
    };
  }, [options, checkboxContainer, searchEl]);

  return { currentNavigateCheckbox, toggleRefocus };
};

export default useCheckboxNavigate;
