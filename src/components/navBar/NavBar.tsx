import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AppMenu } from "../appMenu";
import AppsIcon from "../svgs/AppsIcon";
import DayIcon from "../svgs/DayIcon";
import NightIcon from "../svgs/NightIcon";
import SearchBox from "@/components/customSearchbox/SearchBox";
import SearchBoxView from "@/components/customSearchbox/SearchBoxView";
import Link from "next/link";
import useSearchQuery from "@/hooks/useSearchQuery";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import { useTheme } from "@/context/Theme";
import { Tooltip } from "@chakra-ui/react";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const switchStyle = `flex basis-1/2 items-center justify-center rounded-lg transition-[background-color] duration-500`;

  return (
    <div className="relative w-20 2xl:w-24">
      <div className="relative flex overflow-hidden rounded-lg w-20 h-9 2xl:w-24 2xl:h-12 border border-custom-stroke bg-custom-background">
        <button
          onClick={toggleTheme}
          className={`${switchStyle} ${isLight ? "bg-custom-hover-state" : ""}`}
        >
          <DayIcon className="md:w-4 text-custom-accent dark:text-custom-primary-text" />
        </button>
        <button
          onClick={toggleTheme}
          className={`${switchStyle} ${
            !isLight ? "bg-custom-hover-state" : ""
          }`}
        >
          <NightIcon
            svgProps={{ className: "text-custom-primary-text md:w-4" }}
            pathProps={{
              className:
                "dark:fill-custom-primary-text text-custom-secondary-text",
            }}
          />
        </button>
      </div>
      <div
        className={`rounded-lg top-0 absolute w-1/2 h-full border border-custom-brightOrange-100 dark:border-custom-stroke transition-all duration-300 ${
          isLight ? "left-0" : "left-10 2xl:left-12"
        }`}
      />
    </div>
  );
}

const MenuSwitcher = () => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col">
      <button ref={buttonRef} onClick={() => setIsOpen((v) => !v)} className="">
        <Tooltip
          color="#fafafa"
          hasArrow
          label="All Tools by the Bitcoin Dev Project"
          className="bg-custom-black text-custom-primary-text text-center text-sm font-medium"
          padding="16px"
          borderRadius="8px"
          maxW="180px"
          mx="4px"
          isDisabled={open}
          bgColor="var(--black)"
          placement="bottom-end"
        >
          <div
            className={`flex flex-col rounded-lg border border-custom-brightOrange-100 dark:border-custom-stroke  w-9 h-9 2xl:w-12 2xl:h-12 items-center justify-center transition-[background-color] duration-200 ${
              open
                ? "bg-custom-hover-state shadow-custom-sm"
                : "bg-custom-background"
            }`}
          >
            <div data-freeze-body={open}>
              <AppsIcon className="md:w-7" />
            </div>
          </div>
        </Tooltip>
      </button>
      <div className="relative">
        <div
          data-is-open={open}
          ref={popoverRef}
          className="hidden data-[is-open=true]:block absolute top-0 right-0 mt-3 md:mt-4"
        >
          <AppMenu />
        </div>
      </div>
    </div>
  );
};

const NavBar = () => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();
  const { makeQuery } = useSearchQuery();
  const handleSubmit = (input: string) => {
    makeQuery(input);
  };
  const handleAutoCompleteSelect = (selection) => {
    if (!selection.suggestion) return;
    makeQuery(removeMarkdownCharacters(selection.suggestion));
  };

  return (
    <nav
      className={`navBar pointer-events-auto fixed top-0  text-left md:text-center w-full text-xs md:text-base 2xl:text-xl leading-normal z-20 ${
        hiddenHomeFacet ? "bg-custom-hover-state shadow-md" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between p-3 md:p-5 2xl:p-7 w-full max-w-[1920px] m-auto ${
          !hiddenHomeFacet ? "flex-row-reverse" : ""
        }`}
      >
        <Link className={hiddenHomeFacet ? "" : "hidden"} href="/">
          <Image
            src="/btc-main.png"
            className="max-w-[140px] lg:max-w-[240px] 2xl:max-w-[300px] "
            alt="bitcoin logo"
            width={459}
            height={69}
            priority
          />
        </Link>
        {hiddenHomeFacet && (
          <div className="hidden md:block w-[45vw]">
            <SearchBox
              autocompleteMinimumCharacters={3}
              view={SearchBoxView}
              autocompleteSuggestions={true}
              debounceLength={0}
              onSubmit={handleSubmit}
              className="w-auto mx-10"
              onSelectAutocomplete={handleAutoCompleteSelect}
            />
          </div>
        )}
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeSwitcher />
          <MenuSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
