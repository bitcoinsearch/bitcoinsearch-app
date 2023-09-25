import { useEffect, useRef, useState } from "react";
import { isInViewport } from "../utils/navigation";

type ChekboxNavigateProps = {
  checkboxContainer: React.MutableRefObject<HTMLDivElement>;
  searchEl: React.MutableRefObject<HTMLInputElement>;
  options: any[];
}

const useCheckboxNavigate = ({checkboxContainer, searchEl, options}: ChekboxNavigateProps) => {
  const checkboxNavIndex = useRef<number>(null);
  // const savedNavIndex = useRef(0);
  const [currentNavigateCheckbox, setcurrentNavigateCheckbox] = useState("");

  const refocus = useRef(false);

  const toggleRefocus = () => {
    refocus.current = !refocus.current;
  };

  useEffect(() => {
    const multiCheckboxWrapper = checkboxContainer.current;
    const multiCheckboxList =
      multiCheckboxWrapper && Array.from(multiCheckboxWrapper?.children) as HTMLElement[];
    const searchInput = searchEl.current;
    // focus back to search when options changes
    if (refocus.current) {
      searchInput && searchInput.focus();
      toggleRefocus();
    }

    let currentCheckboxNavIndex = checkboxNavIndex.current;

    const handleOptionNavigation = (e) => {
      const charCode =
        e.keyCode || (typeof e.which === "number" && e.which) || null;

      if (currentNavigateCheckbox && currentCheckboxNavIndex === null) {
        const isPrevCheckInListIdx = multiCheckboxList.findIndex(
          (label) => label?.dataset?.checkbox === currentNavigateCheckbox
        );
        if (isPrevCheckInListIdx !== -1) {
          currentCheckboxNavIndex = isPrevCheckInListIdx;
        }
      }

      switch (charCode) {
        case 40:
          // downArrow
          e.preventDefault();
          if (currentCheckboxNavIndex === null) {
            currentCheckboxNavIndex = 0;
          } else {
            if (currentCheckboxNavIndex >= multiCheckboxList.length - 1) {
              currentCheckboxNavIndex = 0;
            } else {
              currentCheckboxNavIndex += 1;
            }
          }
          break;
        case 38:
          // upArrow
          e.preventDefault();
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
        case 13: {
          // Enter
          e.preventDefault();
          const input = multiCheckboxList[currentCheckboxNavIndex]
            ? multiCheckboxList[currentCheckboxNavIndex].querySelector("input")
            : null;
          if (input) {
            // savedNavIndex.current =
            //   multiCheckboxList[currentCheckboxNavIndex].dataset?.checkbox;
            input.click();
          }
          break;
        }
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

    searchInput &&
      searchInput.addEventListener("focusout", () =>
        setcurrentNavigateCheckbox("")
      );
    return () => {
      searchInput &&
        searchInput.removeEventListener("keydown", handleOptionNavigation);

      searchInput &&
        searchInput.addEventListener("focusout", () =>
          setcurrentNavigateCheckbox("")
        );
    };
  }, [options, checkboxContainer, searchEl, currentNavigateCheckbox]);

  return { currentNavigateCheckbox, toggleRefocus };
};

export default useCheckboxNavigate;
