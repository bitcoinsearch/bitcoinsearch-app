import { Facet, withSearch } from "@elastic/react-search-ui";
import { Sorting } from "@elastic/react-search-ui-views";
import React from "react";
import { useSearchParams } from "react-router-dom";
import CustomMultiCheckboxFacet from "../components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import { getFacetFields, getFacetWithSearch } from "../config/config-helper";

const SideBar = ({ results, wasSearched }) => {
  const [searchParams] = useSearchParams();
  const hasQuery = searchParams.get("q");

  if (!hasQuery || !wasSearched || !results.length) return null;
  return (
    <div>
      {getFacetFields().map((field) => (
        <Facet
          key={field}
          field={field}
          isFilterable={getFacetWithSearch().includes(field)}
          label={field}
          view={CustomMultiCheckboxFacet}
        />
      ))}
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

export default withSearch(({ results, wasSearched }) => ({
  results,
  wasSearched,
}))(SideBar);
