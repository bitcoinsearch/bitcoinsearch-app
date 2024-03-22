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
    onClose()
  };
  return (
    <>
      <div className="flex items-center gap-2 pb-9 text-custom-black-light">
        <span>Showing</span>
        <Popover
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          placement="bottom"
        >
          <PopoverTrigger>
            <Flex
              w="fit-content"
              bgColor="white"
              px={3}
              py={2}
              border="1px solid"
              borderColor="#BFBFBF"
              borderRadius="xl"
              cursor="pointer"
              alignItems="center"
              gap={2}
            >
              <p className="font-bold text-lg leading-none">
                {currentSizeOption.label}
              </p>
              <span data-is-open={isOpen} className="data-[is-open=false]:rotate-180 transition-transform">
                <Image src="./up_arrow.svg" width={11} height={7} alt="arrow"/>
              </span>
            </Flex>
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
                <div key={size.label} className="hover:bg-[#FFF0E0]" role="button" onClick={() => handleSelect(size.value)} >
                  <p className="text-center py-2 px-2 text-lg font-medium">{size.label}</p>
                </div>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <span> of {totalResults} results</span>
      </div>
      <div className="text-red-400">
        <Image src="./dashed_line.svg" height={12} width={300} alt="seperator" />
      </div>
    </>
  );
};

export default ResultSize;
