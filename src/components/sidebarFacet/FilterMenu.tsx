import { Facet, FacetKeys } from "@/types";
import Image from "next/image";
import React from "react";
import SidebarSection from "./SidebarSection";
import useSearchQuery from "@/hooks/useSearchQuery";
import { getFacetFields } from "@/config/config-helper";
import { getFilterValueDisplay } from "@/utils/facet";
import useURLManager from "@/service/URLManager/useURLManager";
import CrossIcon from "public/cross_icon.svg";
import DarkCrossIcon from "public/dark_cross_icon.svg";
import FilterMenuIcon from "../svgs/FilterMenuIcon";
import { useTheme } from "@/context/Theme";

const FilterMenu = () => {
  const { filterFields } = useSearchQuery();

  return (
    <>
      <SidebarSection className="text-custom-primary-text flex justify-between 2xl:pt-10">
        <div className="flex items-center gap-2">
          <FilterMenuIcon />
          <p className="text-base 2xl:text-xl font-bold">Filters</p>
        </div>
      </SidebarSection>
      <AppliedFilters filters={filterFields} />
    </>
  );
};

const AppliedFilters = ({ filters }: { filters: Facet[] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { removeFilterTypes, removeFilter } = useURLManager();
  if (!filters?.length) return null;
  const clearAllFilters = () => {
    removeFilterTypes({
      filterTypes: ["authors", "domain"],
      sortField: "sort_by",
    });
  };
  return (
    <SidebarSection className="text-custom-primary-text">
      <div className="flex justify-between mb-4 2xl:mb-8">
        <p className="text-sm 2xl:text-base font-bold">Applied Filters</p>
        <div
          className="flex gap-2 items-center group/applied-filters"
          role="button"
          onClick={clearAllFilters}
        >
          <span className="text-sm 2xl:text-base group-hover/applied-filters:underline underline-offset-4">
            Clear all
          </span>
          <span className="p-[6px] 2xl:p-2 bg-custom-primary-text rounded-md">
            <Image
              src={isDark ? DarkCrossIcon : CrossIcon}
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
                className="flex gap-3 w-fit py-[10px] px-3 2xl:py-3 2xl:px-4 bg-custom-accent text-custom-white dark:text-custom-background rounded-lg"
                role="button"
                onClick={() =>
                  removeFilter({
                    filterType: filter.field as FacetKeys,
                    filterValue: filter.value as string,
                  })
                }
              >
                <span className="capitalize text-sm font-semibold 2xl:text-sm">
                  {getFilterValueDisplay(filter.value as string, filter.field)}
                </span>
                <Image
                  src={isDark ? DarkCrossIcon : CrossIcon}
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
