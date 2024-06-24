import React, { useEffect, useRef } from "react";
import useCheckboxNavigate from "../../hooks/useCheckboxNavigate";
import styles from "./styles.module.scss";
import appendClassName from "../../utils/elastic-search-ui-functions";
import SidebarSection from "../sidebarFacet/SidebarSection";
import Image from "next/image";
import { FacetKeys } from "@/types";
import useUIContext from "@/hooks/useUIContext";
import LightningIcon from "public/lightning_icon_filled.svg";
import UpArrow from "public/up_arrow.svg";
import { useDisclosure } from "@chakra-ui/react";
import AuthorIcon from "../svgs/AuthorIcon";
import SourceIcon from "../svgs/SourceIcon";
import SearchIcon from "../svgs/SearchIcon";
import PlusIcon from "../svgs/PlusIcon";

const facetMapping = {
  authors: {
    display: "Authors",
    icon: <AuthorIcon />,
  },
  domain: {
    display: "Sources",
    icon: <SourceIcon />,
  },
};

function CustomMultiCheckboxFacet({
  className,
  label,
  onMoreClick,
  onRemove,
  onSelect,
  options,
  showMore,
  showSearch,
  onSearch,
  searchPlaceholder,
}) {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });

  const searchRef = useRef<HTMLInputElement>();
  const multiCheckboxRef = useRef<HTMLDivElement>();

  const { currentNavigateCheckbox, toggleRefocus } = useCheckboxNavigate({
    checkboxContainer: multiCheckboxRef,
    searchEl: searchRef,
    options,
  });

  const numberFormat = new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    notation: "compact",
  });

  useEffect(() => {
    const handleFocusIn = () => {
      onOpen();
    };
    let searchRefInput = searchRef.current;
    if (!searchRefInput) return;
    searchRefInput.addEventListener("focusin", () => handleFocusIn());
    return () => {
      searchRefInput.removeEventListener("focusin", () => handleFocusIn());
    };
  }, [onOpen, onClose]);

  return (
    <SidebarSection className="text-custom-primary-text">
      <fieldset className={appendClassName("", className)}>
        <SideBarHeader label={label} />
        {showSearch && (
          <div className="relative">
            <input
              className="bg-custom-background text-base 2xl:text-base font-medium w-full pl-12 pr-10 py-4 rounded-xl border-[1px] border-custom-stroke focus:outline-none focus:outline-custom-secondary-text focus:outline-offset-0 leading-none"
              type="text"
              placeholder={
                currentNavigateCheckbox ||
                `Search ${facetMapping[label]["display"]}`
              }
              onChange={(e) => {
                onSearch(e.target.value);
              }}
              ref={searchRef}
            />
            <span className="absolute top-1/2 -translate-y-1/2 left-[18px]">
              <SearchIcon className="stroke-custom-secondary-text w-[16px] h-[16px]" />
            </span>
            <span
              data-is-open={isOpen}
              onClick={onToggle}
              className="absolute p-2 cursor-pointer top-1/2 -translate-y-1/2 right-[18px] data-[is-open=false]:rotate-180 transition-transform"
            >
              <Image src={UpArrow} alt="arrow" />
            </span>
          </div>
        )}

        <div
          data-is-open={isOpen}
          className="scroller group/container font-medium data-[is-open='false']:hidden mt-2 max-h-[300px] py-[6px] overflow-auto border border-custom-stroke rounded-xl"
          ref={multiCheckboxRef}
        >
          {options.length < 1 && (
            <p className="w-full text-sm 2xl:text-base text-center px-2">
              No matching options
            </p>
          )}
          {options?.map((option) => {
            const checked = option.selected;
            const value = option.value;
            return (
              <label
                key={option.label}
                htmlFor={`example_facet_${label}${option.label}`}
                data-checkbox={option.label}
              >
                <div
                  data-selected={checked}
                  data-current-navigated={
                    option.label === currentNavigateCheckbox
                  }
                  className="flex gap-1 py-1 2xl:py-2 px-[14px] group/checkOption data-[current-navigated=true]:bg-custom-hover-state group-hover/container:data-[current-navigated=true]:bg-transparent group-hover/container:data-[current-navigated=true]:hover:bg-custom-hover-state data-[selected=true]:text-custom-accent hover:bg-custom-hover-state"
                  onClick={() => (checked ? onRemove(value) : onSelect(value))}
                  role="button"
                  aria-label={`${
                    checked ? "uncheck" : "check"
                  } filter ${label}:${option.label}`}
                >
                  <div
                    className="selectable-option flex grow items-center gap-3"
                    id={`example_facet_${label}${option.label}`}
                  >
                    <Image
                      data-transaction-name={`facet - ${label}`}
                      className="shrink-0 group-data-[selected=false]/checkOption:invisible w-[12px] 2xl:w-[16px] h-auto"
                      src={LightningIcon}
                      alt="bolt icon"
                    />
                    <span className="grow capitalize text-sm 2xl:text-base group-data-[selected=true]/checkOption:font-bold">
                      {option.label}
                    </span>
                  </div>
                  <span className="shrink-0 group-data-[selected=true]/checkOption:font-medium">
                    {numberFormat.format(option.count)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </SidebarSection>
  );
}

export const SideBarHeader = ({ label }: { label: FacetKeys }) => {
  const { openForm } = useUIContext();
  return (
    <div className="flex justify-between mb-4 2xl:mb-6">
      <div className="flex gap-2 items-center">
        {facetMapping[label].icon}
        <span className="text-base 2xl:text-lg font-bold">
          {facetMapping[label]["display"]}
        </span>
      </div>
      {label === "domain" && (
        <div
          className="flex gap-2 items-center group/source"
          role="button"
          onClick={openForm}
        >
          <span className="group-hover/source:underline underline-offset-4 text-sm font-medium">
            Suggest a source
          </span>
          <span className="p-[6px] bg-custom-primary-text group-hover/source:bg-custom-accent  rounded-md">
            <PlusIcon className="text-custom-background" />
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomMultiCheckboxFacet;
