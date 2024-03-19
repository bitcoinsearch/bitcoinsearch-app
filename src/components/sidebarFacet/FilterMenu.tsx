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

const FilterMenu = () => {
  const { filterFields } = useSearchQuery();

  return (
    <div className="text-custom-black-light">
      <SidebarSection>
        <div className="flex items-center gap-2">
          <Image src="./filter.svg" alt="filter" height={25} width={25} />
          <p className="text-xl font-bold">Filters</p>
        </div>
      </SidebarSection>
      <AppliedFilters filters={filterFields} />
    </div>
  );
};

const AppliedFilters = ({ filters }: { filters: Facet[] }) => {
  const { removeFilterTypes, removeFilter } = useURLManager();
  if (!filters?.length) return null;
  const clearAllFilters = () => {
    removeFilterTypes(["authors", "domain"]);
  };
  return (
    <SidebarSection>
      <div className="flex justify-between mb-8">
        <p>Applied Filters</p>
        <div
          className="flex gap-2 items-center group"
          role="button"
          onClick={clearAllFilters}
        >
          <span className="group-hover:underline underline-offset-4">
            Clear all
          </span>
          <span className="p-2 bg-custom-black-light rounded-md">
            <Image
              src="./cross_icon.svg"
              width={10}
              height={10}
              alt="clear all"
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
                className="flex gap-3 w-fit py-3 px-4 bg-custom-orange-dark text-custom-white rounded-lg"
                role="button"
                onClick={() =>
                  removeFilter({
                    filterType: filter.field,
                    filterValue: filter.value,
                  })
                }
              >
                <span>{getFilterValueDisplay(filter.value, filter.field)}</span>
                <Image
                  src="./cross_icon.svg"
                  width={10}
                  height={10}
                  alt="remove"
                />
              </div>
            ));
        })}
      </div>
    </SidebarSection>
  );
};

export default FilterMenu;
