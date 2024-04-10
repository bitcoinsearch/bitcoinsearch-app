import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import UpArrow from "public/up_arrow.svg";

const sizes = [
  {
    label: "1-10",
    value: 10,
  },
  {
    label: "1-25",
    value: 25,
  },
  {
    label: "1-50",
    value: 50,
  },
  {
    label: "1-75",
    value: 75,
  },
  {
    label: "1-100",
    value: 100,
  },
];

const ResultSize = () => {
  const { setResultsSize } = useURLManager();
  const { resultsPerPage: currentSize, totalResults } =
    useSearchQuery().pagingInfo;
  const currentSizeOption =
    sizes.find((size) => size.value === currentSize) ?? sizes[0];
  const handleSelect = (size: number) => {
    setResultsSize(size);
  };
  return (
    <>
      <div className="flex items-center gap-2 pb-9 text-custom-primary-text text-sm lg:text-base 2xl:text-lg">
        <span>Showing</span>
        <Menu
          closeOnBlur={true}
          matchWidth={true}
          gutter={10}
          placement="bottom"
          variant="brand"
        >
          <MenuButton
            as="button"
            // style={{ width: "100%" }}
            className="group/resultSize"
          >
            <div className="flex items-center gap-1 lg:gap-2 cursor-pointer w-fit py-2 px-2 lg:px-3 border-[1px] border-custom-secondary-text leading-none rounded-lg lg:rounded-xl ">
              <p className="font-bold leading-none min-w-fit">
                {currentSizeOption.label}
              </p>
              <span className="group-aria-[expanded=false]/resultSize:rotate-180 transition-transform">
                <Image src={UpArrow} alt="arrow" className="w-2 lg:w-[11px] " />
              </span>
            </div>
          </MenuButton>
          <MenuList
            id="test"
            w="full"
            minW="none"
            _focusVisible={{ boxShadow: "none", outline: "none" }}
          >
            <div className="rounded-xl overflow-clip bg-custom-background border-[1px] border-custom-stroke">
              {sizes.map((size) => (
                <MenuItem
                  key={size.label}
                  className="hover:bg-custom-hover-state"
                  role="button"
                  onClick={() => handleSelect(size.value)}
                  p={0}
                  m={0}
                  width="full"
                >
                  <div className="w-full px-1 py-[6px] hover:bg-custom-hover-state">
                    <p className="text-center py-2 font-medium">
                      {size.label}
                    </p>
                  </div>
                </MenuItem>
              ))}
            </div>
          </MenuList>
        </Menu>
        of <span className="font-bold">{totalResults}</span> results
      </div>
      <div className="group-data-[no-border='true']:hidden border-b border-custom-stroke">
      </div>
    </>
  );
};

export default ResultSize;
