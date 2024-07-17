import React from "react";
import CustomMultiCheckboxFacet from "../components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import { getFacetFields, getFacetWithSearch } from "../config/config-helper";
import Facet from "@/components/sidebarFacet/Facet";
import SortingFacet from "@/components/sidebarFacet/SortingFacet";
import SortingView from "@/components/sidebarFacet/Sorting/SortingView";
import ResultSize from "@/components/sidebarFacet/ResultSize";
import FilterMenu from "@/components/sidebarFacet/FilterMenu";
import ShowFilterResultsMobile from "@/components/sidebarFacet/ShowFilterResultsMobile";
import useUIContext from "@/hooks/useUIContext";

const SideBar = () => {
  const { sidebarToggleManager } = useUIContext();
  const isMobile = window
    ? window.matchMedia("(max-width: 600px)").matches
    : false;

  const sortCallback = () => {
    if (isMobile) {
      sidebarToggleManager.updater(false);
    }
  };
  const facetCallback = () => {
    if (isMobile) {
      sidebarToggleManager.updater(false);
    }
  };

  return (
    <div className="w-full md:w-[300px] bg-custom-background">
      <div className="hidden lg:block">
        <ResultSize />
      </div>
      <FilterMenu />
      <SortingFacet
        field="sort_by"
        label="Sort by"
        view={SortingView}
        sortOptions={[
          { label: "Relevance", value: " " },
          {
            label: "Newest First",
            value: "created_at:desc",
          },
          {
            label: "Oldest First",
            value: "created_at:asc",
          },
        ]}
        callback={sortCallback}
      />
      {getFacetFields().map((field) => (
        <Facet
          key={field}
          field={field}
          isFilterable={getFacetWithSearch().includes(field)}
          label={field}
          view={CustomMultiCheckboxFacet}
          callback={facetCallback}
        />
      ))}
      <ShowFilterResultsMobile />
    </div>
  );
};

export default SideBar;
