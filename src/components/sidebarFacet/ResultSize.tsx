import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import {
  Button,
  Flex,
  Icon,
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
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { setResultsSize } = useURLManager();
  const { resultsPerPage: currentSize, totalResults } =
    useSearchQuery().pagingInfo;
  const currentSizeOption =
    sizes.find((size) => size.value === currentSize) ?? sizes[0];
  const handleSelect = (size: number) => {
    setResultsSize(size);
    onClose();
  };
  return (
    <>
      <div className="flex items-center gap-2 pb-9 text-custom-primary-text text-sm lg:text-base 2xl:text-lg">
        <span>Showing</span>
        <Popover
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          placement="bottom"
        >
          <PopoverTrigger>
            <div className="flex items-center gap-1 lg:gap-2 cursor-pointer w-fit py-2 px-2 lg:px-3 border-[1px] border-custom-secondary-text leading-none rounded-lg lg:rounded-xl ">
              <p className="font-bold leading-none min-w-fit">
                {currentSizeOption.label}
              </p>
              <span
                data-is-open={isOpen}
                className="data-[is-open=false]:rotate-180 transition-transform"
              >
                <Image src={UpArrow} alt="arrow" className="w-2 lg:w-[11px] " />
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent
            w="fit-content"
            _focusVisible={{ boxShadow: "none", outline: "none" }}
            border="1px solid"
            borderColor="#BFBFBF"
            borderRadius="md"
          >
            <PopoverBody p="0px">
              {sizes.map((size) => (
                <div
                  key={size.label}
                  className="hover:bg-custom-hover-state"
                  role="button"
                  onClick={() => handleSelect(size.value)}
                >
                  <p className="text-center py-2 px-2 font-medium">
                    {size.label}
                  </p>
                </div>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
         of <span className="font-bold">{totalResults}</span> results
      </div>
      <div className="group-data-[no-border='true']:hidden">
        <Image
          src="./dashed_line.svg"
          height={12}
          width={300}
          alt="seperator"
        />
      </div>
    </>
  );
};

export default ResultSize;
