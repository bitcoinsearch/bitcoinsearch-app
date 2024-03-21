import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import Image from "next/image";
import AppsIcon from "../svgs/AppsIcon";
import NightIcon from "../svgs/NightIcon";
import DayIcon from "../svgs/DayIcon";
import { useState } from "react";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { AppMenu } from "../appMenu";

function ThemeSwitcher() {
  const [isLight, setIsLight] = useState(true);

  return (
    <div className="relative w-20 2xl:w-24">
      <div className="relative flex overflow-hidden rounded-lg w-20 h-9 2xl:w-24 2xl:h-12 border border-gray">
        <button
          onClick={() => setIsLight(false)}
          className="flex basis-1/2 items-center justify-center"
        >
          <NightIcon />
        </button>
        <button
          onClick={() => setIsLight(true)}
          className="flex basis-1/2 items-center justify-center"
        >
          <DayIcon />
        </button>
      </div>
      <div
        className={`rounded-lg top-0 absolute w-9 h-9 2xl:w-12 2xl:h-12 border border-brightOrange-100 transition-all duration-300 ${
          isLight ? "left-11 2xl:left-12" : "left-0"
        }`}
      />
    </div>
  );
}

const MenuSwitcher = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex flex-col rounded-lg border border-brightOrange-100 w-9 h-9 2xl:w-12 2xl:h-12 items-center justify-center">
          <AppsIcon />
        </div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            <AppMenu />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

const NavBar = () => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (!hiddenHomeFacet) return null;

  return (
    <nav className="bg-lightOrange fixed shadow-md text-left md:text-center w-full text-xs md:text-base 2xl:text-xl leading-normal z-10">
      <div className="flex items-center justify-between p-3 md:p-5 2xl:p-7 w-full max-w-[1920px] m-auto">
        <div className="flex gap-2 md:gap-3 items-center self-center">
          <Image
            src="/btc.png"
            className="w-5 h-5 md:w-9 md:h-9"
            alt="bitcoin logo"
            width={36}
            height={36}
            priority
          />
          <p className="text-lg md:text-2xl 2xl:text-4xl font-bold italic text-gray bg-gradient-92 from-brightOrange-100 to-brightOrange-300 text-opacity-0 bg-clip-text p-1">
            bitcoin search
          </p>
        </div>
        <div className="hidden lg:block">New Search</div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <MenuSwitcher />
          {/* <button className="flex flex-col rounded-lg border border-brightOrange-100 w-9 h-9 2xl:w-12 2xl:h-12 items-center justify-center">
            <AppsIcon />
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
