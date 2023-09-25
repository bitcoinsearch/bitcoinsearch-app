import { Button, Container, Heading } from "@chakra-ui/react";
import React, { useState } from "react";
import { getTopKeywords } from "../../config/config-helper";
import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";

const KeywordsSearchSelection = ({}) => {
  const {
    queryResult: { data, isLoading },
    searchQuery,
    makeQuery,
  } = useSearchQuery();
  const { getSearchTerm } = useURLManager();

  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  const searchTerm = getSearchTerm();
  const topKeywords = getTopKeywords();

  const handleToggleKeyword = (filter: {count: number, value: string}, isSelected: boolean) => {
    if (isLoading) return;
    if (!isSelected) {
      makeQuery(filter.value);
    } else {
      makeQuery("");
    }
  };

  if (hiddenHomeFacet || !topKeywords.length) {
    return null;
  }

  return (
    <>
      <Container maxW="1300px">
        <Heading
          textAlign="center"
          fontSize={[null, null, "14px", "18px", "20px"]}
          my={4}
        >
          Search by Keyword
        </Heading>
        <div className={`home-facet-container`}>
          {topKeywords.map((a, idx) => {
            const selected = searchTerm === a.value && isLoading;
            return (
              <Button
                variant="facet-pill"
                size="no-size"
                style={{ animationDelay: `${idx * 60}ms` }}
                key={`${a.value}_${idx}`}
                className={`home-facet-tag ${selected ? "tag-selected" : ""}`}
                onClick={() => handleToggleKeyword(a, selected)}
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

export default KeywordsSearchSelection
