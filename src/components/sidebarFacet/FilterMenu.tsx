import { generateFilterQuery } from "@/service/URLManager/helper";
import { Facet } from "@/types";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import SidebarSection from "./SidebarSection";
import useSearchQuery from "@/hooks/useSearchQuery";
import { getFacetFields } from "@/config/config-helper";
import { getFilterValueDisplay } from "@/utils/facet";
import useURLManager from "@/service/URLManager/useURLManager";
import FilterIcon from "public/filter.svg";
import CrossIcon from "public/cross_icon.svg";
import useUIContext from "@/hooks/useUIContext";
import CloseSidebarIcon from "public/close_sidebar.svg";

const FilterMenu = () => {
  const { filterFields } = useSearchQuery();
  const { sidebarToggleManager } = useUIContext();

  return (
    <>
      <SidebarSection className="text-custom-primary-text flex justify-between 2xl:pt-10">
        <div className="flex items-center gap-2">
          <Image
            src={FilterIcon}
            alt="filter"
            className="w-[20px] 2xl:w-[25px]"
          />
          <p className="text-base 2xl:text-xl font-bold">Filters</p>
        </div>
        <span
          className="md:hidden"
          onClick={() => sidebarToggleManager.updater(false)}
        >
          <Image src={CloseSidebarIcon} alt="close sidebar" className="" />
        </span>
      </SidebarSection>
      <AppliedFilters filters={filterFields} />
    </>
  );
};

const AppliedFilters = ({ filters }: { filters: Facet[] }) => {
  const { removeFilterTypes, removeFilter } = useURLManager();
  if (!filters?.length) return null;
  const clearAllFilters = () => {
    removeFilterTypes(["authors", "domain"]);
  };
  return (
    <SidebarSection className="text-custom-primary-text">
      <div className="flex justify-between mb-4 2xl:mb-8">
        <p className="text-sm 2xl:text-base font-bold">Applied Filters</p>
        <div
          className="flex gap-2 items-center group"
          role="button"
          onClick={clearAllFilters}
        >
          <span className="text-sm 2xl:text-base group-hover:underline underline-offset-4">
            Clear all
          </span>
          <span className="p-[6px] 2xl:p-2 bg-custom-primary-text rounded-md">
            <Image
              src={CrossIcon}
              alt="clear all"
              className="w-[8px] 2xl:w-[10px]"
            />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {getFacetFields().map((facet) => {
          return filters
            .filter((filter) => filter.field === facet)
            .map((filter) => (
              <div
                key={filter.field}
                className="flex gap-3 w-fit py-[10px] px-3 2xl:py-3 2xl:px-4 bg-custom-accent text-custom-white rounded-lg"
                role="button"
                onClick={() =>
                  removeFilter({
                    filterType: filter.field,
                    filterValue: filter.value,
                  })
                }
              >
                <span className="text-xs 2xl:text-sm">
                  {getFilterValueDisplay(filter.value, filter.field)}
                </span>
                <Image
                  src={CrossIcon}
                  alt="remove"
                  className="w-[8px] 2xl:w-[10px]"
                />
              </div>
            ));
        })}
      </div>
    </SidebarSection>
  );
};

export default FilterMenu;
