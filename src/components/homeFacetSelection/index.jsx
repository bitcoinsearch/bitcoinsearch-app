import { Box, Button, Heading } from "@chakra-ui/react";
import { withSearch } from "@elastic/react-search-ui";
import React, { useEffect, useRef, useState } from "react";
import { buildSearchOptionsFromConfig } from "../../config/config-helper";
import useSearchContext from "../../hooks/useSearchContext";

const InitialFacetSection = ({
  filters,
  addFilter,
  removeFilter,
  field,
  resultSearchTerm,
}) => {
  const { events } = useSearchContext();
  const [fieldData, setFieldData] = useState([]);
  const initialPageLoad = useRef(true);

  useEffect(() => {
    if (initialPageLoad.current) {
      initialPageLoad.current = false;
      events
        .search(
          {
            searchTerm: "",
          },
          {
            current: 1,
            facets: { [field]: { type: "value", size: 20 } },
            result_fields: buildSearchOptionsFromConfig().result_fields,
          }
        )
        .then((res) => {
          const data = res.facets[field]?.[0]?.data ?? [];
          setFieldData(data);
        });
    }
    return () => {
      initialPageLoad.current = true;
    };
  }, [events, field]);

  const onRemove = (value) => {
    removeFilter(field, value, "any");
  };
  const onAdd = (value) => {
    addFilter(field, value, "any");
  };
  const handleToggleFilter = (filter, isSelected) => {
    if (isSelected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  const filterForField = () => {
    return filters.find((filter) => filter.field === field);
  };

  if (resultSearchTerm?.trim()) {
    return null;
  }

  // if (hiddenHomeFacet) {
  //   return null;
  // }

  return (
    <>
      {fieldData?.length ? (
        <Box>
          <Heading
            textAlign="center"
            fontSize={[null, null, "14px", "18px", "20px"]}
            my={4}
          >
            Top Authors
          </Heading>
          <div className={`home-facet-container`}>
            {fieldData?.map((a, idx) => {
              const selected = Boolean(
                filterForField()?.values?.some((el) => el === a.value)
              );
              return (
                <Button
                  variant="facet-pill"
                  size="no-size"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  key={`${a.value}_${idx}`}
                  className={`home-facet-tag ${selected ? "tag-selected" : ""}`}
                  onClick={() => handleToggleFilter(a, selected)}
                >
                  {a.value}
                </Button>
              );
            })}
          </div>
        </Box>
      ) : null}
    </>
  );
};

export default withSearch(
  ({ filters, addFilter, removeFilter, resultSearchTerm }) => ({
    filters,
    addFilter,
    removeFilter,
    resultSearchTerm,
  })
)(InitialFacetSection);
