import {
  Box,
  Flex,
  FormControl,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import { SortingViewProps } from "./types";
import Image from "next/image";
import SidebarSection from "../SidebarSection";
import SortIcon from "public/sort_icon.svg"

const SortingView = ({
  onChange,
  options,
  value,
  label,
  option,
}: SortingViewProps) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  return (
    <SidebarSection className="text-custom-black-light">
      <label className="flex gap-2 mb-4 lg:mb-6 items-center">
        <Image src={SortIcon} alt={label} className="w-[20px] h-[20px] lg:w-[25px]" />
        <p className="lg:text-lg font-bold">{label}</p>
      </label>
      <FormControl>
        <Box position="relative" w="full">
          <Popover
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            placement="bottom-start"
            returnFocusOnClose={false}
            // initialFocusRef={inputRef}
            closeOnBlur={true}
            closeOnEsc={true}
            matchWidth={true}
            gutter={10}
          >
            <PopoverTrigger>
              <div
                className="w-full flex bg-white px-4 py-3 border-[1px] border-custom-grey-light items-center justify-between rounded-xl"
              >
                <p className="text-sm lg:text-base font-bold text-custom-black-light ">
                  {option.label}
                </p>
                <span data-is-open={isOpen} className="data-[is-open=false]:rotate-180 transition-transform">
                  <Image src="./up_arrow.svg" width={11} height={7} alt="arrow"/>
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              w="full"
              _focusVisible={{ boxShadow: "none", outline: "none" }}
              border="1px solid"
              borderColor="#BFBFBF"
              borderRadius="xl"
            >
              <PopoverBody padding={0} borderRadius="2xl">
                {options.map((item, index) => (
                  <div
                    key={`${item.label}_${index}`}
                    onClick={() => {
                      onChange(item.value);
                      onClose();
                    }}
                    data-selected={option.value === item.value}
                    className="group pl-5 pr-2 my-4 font-medium data-[selected=false]:hover:text-custom-grey-dark"
                    role="button"
                  >
                    <span className="flex gap-2">
                      {/* <span><img src="/lightning_icon_filled.svg" height={16} width={16} /></span> */}
                      <Image
                        className="group-data-[selected=false]:invisible"
                        src="./lightning_icon_filled.svg"
                        height={16}
                        width={16}
                        alt=""
                      />
                      <span className="group-data-[selected=true]:text-[#F7931A] group-data-[selected=true]:font-bold">
                        {item.label}
                      </span>
                    </span>
                  </div>
                ))}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </FormControl>
    </SidebarSection>
  );
};

export default SortingView;
