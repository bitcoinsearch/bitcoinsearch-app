import { Button, Container, Heading } from "@chakra-ui/react";
import { withSearch } from "@elastic/react-search-ui";
import React from "react";
import { getTopAuthors } from "../../config/config-helper";

const InitialFacetSection = ({
  filters,
  addFilter,
  removeFilter,
  field = "authors",
  resultSearchTerm,
  results,
  isLoading,
}) => {
  const isSearched = Boolean(
    results.length &&
      (resultSearchTerm?.trim() || (filters.length && results?.length))
  );

  const onRemove = (value) => {
    removeFilter(field, value, "all");
  };
  const onAdd = (value) => {
    addFilter(field, value, "all");
  };
  const handleToggleFilter = (filter, isSelected) => {
    if (isLoading) return;
    if (isSelected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };
  const filterForField = () => {
    return filters.find((filter) => filter.field === field);
  };

  if (isSearched) {
    return null;
  }

  return (
    <>
      {getTopAuthors()?.length ? (
        <Container maxW="1300px">
          <Heading
            textAlign="center"
            fontSize={[null, null, "14px", "18px", "20px"]}
            my={4}
          >
            Search by Author
          </Heading>
          <div className={`home-facet-container`}>
            {getTopAuthors()?.map((a, idx) => {
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
        </Container>
      ) : null}
    </>
  );
};

export default withSearch(
  ({
    filters,
    addFilter,
    removeFilter,
    resultSearchTerm,
    results,
    isLoading,
  }) => ({
    filters,
    addFilter,
    removeFilter,
    resultSearchTerm,
    results,
    isLoading,
  })
)(InitialFacetSection);
