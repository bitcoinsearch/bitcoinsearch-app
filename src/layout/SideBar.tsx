import { Sorting } from "@elastic/react-search-ui-views";

import React from "react";
import CustomMultiCheckboxFacet from "../components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import { getFacetFields, getFacetWithSearch } from "../config/config-helper";
import useIsInitialStateWithoutFilter from "../hooks/useIsInitialStateWithoutFilter";
import Facet from "@/components/sidebarFacet/Facet";
import SortingFacet from "@/components/sidebarFacet/SortingFacet";

const SideBar = () => {
  const { hiddenBody, hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (hiddenBody) {
    return null;
  }

  return (
    <div>
      {hiddenHomeFacet
        ? getFacetFields().map((field) => (
            <Facet
              key={field}
              field={field}
              isFilterable={getFacetWithSearch().includes(field)}
              label={field}
              view={CustomMultiCheckboxFacet}
            />
          ))
        : getFacetFields()
            .filter((field) => !getFacetWithSearch().includes(field))
            .map((field) => (
              <Facet
                key={field}
                field={field}
                isFilterable={getFacetWithSearch().includes(field)}
                label={field}
                view={CustomMultiCheckboxFacet}
              />
            ))}
      <SortingFacet
        field="created_at"
        label="Sort by date"
        view={Sorting}
        sortOptions={[
          { label: "-", value: " ", field: "created_at" },
          {
            label: "Newest first",
            value: "desc",
            field: "created_at",
          },
          {
            label: "Oldest first",
            value: "asc",
            field: "created_at",
          },
        ]}
      />
    </div>
  );
};

export default SideBar;
