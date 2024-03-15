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

const SortingView = ({
  onChange,
  options,
  value,
  label,
  option,
}: SortingViewProps) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  return (
    <>
      <label></label>
      <FormControl pb={2}>
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
              <Flex
                w="full"
                bgColor="blackAlpha.100"
                px={2}
                py={1}
                rounded="md"
                border="2px solid"
                borderColor="gray.200"
                borderRadius="md"
                cursor="pointer"
                justifyContent="space-between"
              >
                <Text color="gray.600" fontSize="14px" fontWeight={500}>
                  {option.label}
                </Text>
                <Icon color="gray.600" as={IoIosArrowDown} />
              </Flex>
            </PopoverTrigger>
            <PopoverContent
              w="full"
              _focusVisible={{ boxShadow: "none", outline: "none" }}
              border="1px solid"
              borderColor="#BFBFBF"
              borderRadius="md"
            >
              <PopoverBody>
                {options.map((item, index) => (
                  <div
                    key={`${item.label}_${index}`}
                    onClick={() => {
                      onChange(item.value);
                      onClose();
                    }}
                    data-selected={option.value === item.value}
                    className="group hover:bg-[#] text-[#4D4D4D]"
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
                      <span className="group-data-[selected=true]:text-[#F7931A]">
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
    </>
  );
};

export default SortingView;
