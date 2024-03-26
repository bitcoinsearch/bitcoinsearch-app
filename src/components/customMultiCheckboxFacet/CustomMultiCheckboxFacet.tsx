import React, { useEffect, useRef } from "react";
import mapping from "../../config/mapping.json";
import useCheckboxNavigate from "../../hooks/useCheckboxNavigate";
import styles from "./styles.module.scss";
import appendClassName from "../../utils/elastic-search-ui-functions";
import { deriveNameFromUrl } from "@/config/mapping-helper";
import SidebarSection from "../sidebarFacet/SidebarSection";
import Image from "next/image";
import { FacetKeys } from "@/types";
import useUIContext from "@/hooks/useUIContext";
import LightningIcon from "public/lightning_icon_filled.svg"
import UpArrow from "public/up_arrow.svg"
import { useDisclosure } from "@chakra-ui/react";

const facetMapping = {
  authors: {
    display: "Authors",
    icon: "./author_icon.svg",
  },
  domain: {
    display: "Sources",
    icon: "./source_icon.svg",
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
  const {isOpen, onToggle, onOpen, onClose} = useDisclosure({defaultIsOpen: false})
  // This function was modified to add the mapping of names to links using mapping?.labels[filterValue]
  function getFilterValueDisplay(filterValue, label) {
    if (filterValue === undefined || filterValue === null) {
      return "";
    }
    if (Object.prototype.hasOwnProperty.call(filterValue, "name")) {
      return filterValue.name;
    }
    if (label === "domain") {
      if (mapping?.labels[filterValue]) {
        return mapping?.labels[filterValue];
      } else {
        return deriveNameFromUrl(filterValue);
      }
    }
    return String(filterValue);
  }

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
      onOpen()
    }
    const handleFocusOut = () => {
      onClose()
    }
    let searchRefInput = searchRef.current
    if (!searchRefInput) return
    searchRefInput.addEventListener("focusin", () => handleFocusIn())
    searchRefInput.addEventListener("focusout", () => handleFocusOut())
    return () => {
      searchRefInput.removeEventListener("focusin", () => handleFocusIn())
      searchRefInput.removeEventListener("focusout", () => handleFocusOut())
    }
  }, [onOpen, onClose])
  

  return (
    <SidebarSection className="text-custom-black-light">
      <fieldset className={appendClassName("", className)}>
        <SideBarHeader label={label} />
        {showSearch && (
          <div className="relative">
            <input
              className="text-sm lg:text-base font-medium w-full pl-12 pr-10 py-4 rounded-xl border-[1px] border-custom-grey-light group focus-visible:outline-custom-grey-dark focus-visible:outline-offset-0 leading-none"
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
              <Image
                src="./search_icon.svg"
                width={18}
                height={18}
                alt="search"
                className=""
              />
            </span>
            <span data-is-open={isOpen} onClick={onToggle} className="absolute p-2 cursor-pointer top-1/2 -translate-y-1/2 right-[18px] data-[is-open=false]:rotate-180 transition-transform">
              <Image src={UpArrow} alt="arrow"/>
            </span>
            {/* {!searchRef.current.textContent.trim() && (
              <span className="absolute top-1/2 -translate-y-1/2 right-4">
                <Image
                  src={"./up_arrow.svg"}
                  width={12}
                  height={7}
                  alt="arrow"
                />
              </span>
            )} */}
          </div>
        )}

        <div
          data-is-open={isOpen}
          className="data-[is-open='false']:hidden data-[is-open='false']:md:block mt-2 max-h-[300px] py-[6px] overflow-scroll border border-custom-grey-light rounded-xl"
          ref={multiCheckboxRef}
        >
          {options.length < 1 && <p className="w-full text-sm lg:text-base text-center px-2">No matching options</p>}
          {options?.map((option) => {
            const checked = option.selected;
            const value = option.value;
            const valueDisplay = getFilterValueDisplay(option.value, label);
            return (
              <label
                key={valueDisplay}
                htmlFor={`example_facet_${label}${valueDisplay}`}
                data-checkbox={valueDisplay}
                data-selected={checked}
                data-current-navigated={
                  valueDisplay === currentNavigateCheckbox
                }
                className="group flex justify-between py-1 lg:py-2 px-[14px] data-[current-navigated=true]:bg-red-400 data-[selected=true]:text-custom-orange-dark"
              >
                <div
                  className="selectable-option flex items-center gap-3"
                  id={`example_facet_${label}${valueDisplay}`}
                  onClick={() => (checked ? onRemove(value) : onSelect(value))}
                  role="button"
                >
                  <Image
                    data-transaction-name={`facet - ${label}`}
                    className="group-data-[selected=false]:invisible w-[12px] lg:w-[16px]"
                    src={LightningIcon}
                    alt="bolt icon"
                  />
                  {/* <input
                    data-transaction-name={`facet - ${label}`}
                    id={`example_facet_${label}${valueDisplay}`}
                    type="checkbox"
                    className="sui-multi-checkbox-facet__checkbox"
                    checked={checked}
                    onChange={() =>
                      checked ? onRemove(value) : onSelect(value)
                    }
                  /> */}
                  <span className="text-sm lg:text-base group-data-[selected=true]:font-bold">
                    {valueDisplay}
                  </span>
                </div>
                <span className="group-data-[selected=true]:font-medium">
                  {numberFormat.format(option.count)}
                </span>
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
    <div className="flex justify-between mb-4 lg:mb-6">
      <div className="flex gap-2 items-center">
        <Image
          src={facetMapping[label]["icon"]}
          width={20}
          height={20}
          alt={label}
          className="w-[18px] lg:w-[20px]"
        />
        <span className="text-base lg:text-lg font-bold">
          {facetMapping[label]["display"]}
        </span>
      </div>
      {label === "domain" && (
        <div
          className="flex gap-2 items-center group"
          role="button"
          onClick={openForm}
        >
          <span className="group-hover:underline underline-offset-4 text-sm font-medium">
            Suggest a source
          </span>
          <span className="p-[6px] bg-custom-black-light group-hover:bg-custom-orange-dark rounded-md">
            <Image
              src="./plus_icon.svg"
              width={10}
              height={10}
              alt="add source"
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomMultiCheckboxFacet;
