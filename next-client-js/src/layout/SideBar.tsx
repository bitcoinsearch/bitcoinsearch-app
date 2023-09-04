import { Sorting } from "@elastic/react-search-ui";

import React from "react";
import CustomMultiCheckboxFacet from "../components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import { getFacetFields, getFacetWithSearch } from "../config/config-helper";
import useIsInitialStateWithoutFilter from "../hooks/useIsInitialStateWithoutFilter";
import Facet from "@/components/sidebarFacet/Facet";

const SideBar = () => {
  const { hiddenBody, hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  // if (hiddenBody) {
  //   return null;
  // }

  return (
    <div>
      {
        
          <Facet
            key={"authors"}
            field={"authors"}
            isFilterable={getFacetWithSearch().includes("authors")}
            label={"authors"}
            view={CustomMultiCheckboxFacet}
          />
        
      }
      {/* {hiddenHomeFacet
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
            ))} */}
      <Sorting
        label="Sort by date"
        sortOptions={[
          { name: "-", value: "", direction: "" },
          {
            name: "Newest first",
            value: "created_at",
            direction: "desc",
          },
          {
            name: "Oldest first",
            value: "created_at",
            direction: "asc",
          },
        ]}
      />
    </div>
  );
};

export default SideBar;
