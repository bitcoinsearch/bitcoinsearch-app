import {
  FormControl,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { SortingViewProps } from "./types";
import Image from "next/image";
import SidebarSection from "../SidebarSection";
import SortIcon from "public/sort_icon.svg";

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
        <Image
          src={SortIcon}
          alt={label}
          className="w-[20px] h-[20px] lg:w-[25px]"
        />
        <p className="lg:text-lg font-bold">{label}</p>
      </label>
      <FormControl>
        <Menu
          placement="bottom"
          closeOnBlur={true}
          matchWidth={true}
          gutter={10}
        >
          <MenuButton as="button" style={{ width: "100%" }}>
            <div className="w-full flex bg-white px-4 py-3 border-[1px] border-custom-grey-light items-center justify-between rounded-xl">
              <p className="text-sm lg:text-base font-bold text-custom-black-light ">
                {option.label}
              </p>
              <span
                data-is-open={isOpen}
                className="data-[is-open=false]:rotate-180 transition-transform"
              >
                <Image src="./up_arrow.svg" width={11} height={7} alt="arrow" />
              </span>
            </div>
          </MenuButton>
          <MenuList
            w="full"
            _focusVisible={{ boxShadow: "none", outline: "none" }}
            border="1px solid"
            borderColor="#BFBFBF"
            borderRadius="xl"
            py={3}
          >
            {options.map((item, index) => (
              <MenuItem
                key={`${item.label}_${index}`}
                onClick={() => {
                  onChange(item.value);
                }}
                data-selected={option.value === item.value}
                className="group"
                p={0}
                m={0}
              >
                <div className="w-full px-5 py-[6px] flex gap-2 font-medium group-data-[selected=false]:hover:bg-custom-orange-light">
                  <Image
                    className="group-data-[selected=false]:invisible"
                    src="./lightning_icon_filled.svg"
                    height={16}
                    width={16}
                    alt=""
                  />
                  <span className="group-data-[selected=true]:text-custom-orange-dark group-data-[selected=true]:font-bold">
                    {item.label}
                  </span>
                </div>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
    </SidebarSection>
  );
};

export default SortingView;
