import { Button, Container, Heading } from "@chakra-ui/react";
import React, { useLayoutEffect, useRef } from "react";
import { getTopAuthors } from "../../config/config-helper";
import useURLManager from "@/service/URLManager/useURLManager";
import useSearchQuery from "@/hooks/useSearchQuery";

const InitialFacetSection = ({
  field = "authors" as const,
}) => {
  const { queryResult: {isLoading, data}, searchQuery} = useSearchQuery()
  const { getFilter, addFilter: addFilterNew, removeFilter: removeFilterNew } = useURLManager();
  
  const filterForField = () => {
    return getFilter(field);
  };
  
  const isSearched = Boolean(
    data?.hits?.hits?.length &&
      (searchQuery?.trim() || (filterForField.length))
  );
  const topAuthors = getTopAuthors();

  const initRender = useRef(true);
  useLayoutEffect(() => {
    if (initRender.current) {
      initRender.current = false;
    }
    return () => {
      initRender.current = true;
    };
  }, []);

  const onRemove = (value) => {
    removeFilterNew({filterType: field, filterValue: value});
  };
  const onAdd = (value) => {
    addFilterNew({filterType: field, filterValue: value});
  };
  const handleToggleFilter = (filter, isSelected: boolean) => {
    if (isLoading) return;
    if (isSelected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  if (isSearched) {
    return null;
  }

  if (!topAuthors?.length) return null;

  return (
    <>
      <Container maxW="1300px">
        <Heading
          textAlign="center"
          fontSize={[null, null, "14px", "18px", "20px"]}
          my={4}
        >
          Search by Author
        </Heading>
        <div className={`home-facet-container`}>
          {topAuthors?.map((a, idx) => {
            const selected = Boolean(
              filterForField()?.some((el) => el === a.value)
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
    </>
  );
};

export default InitialFacetSection;
