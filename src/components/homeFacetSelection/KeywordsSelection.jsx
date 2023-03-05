import { Button, Container, Heading } from "@chakra-ui/react";
import { withSearch } from "@elastic/react-search-ui";
import React, { useState } from "react";
import { getTopKeywords } from "../../config/config-helper";

const KeywordsSearchSelection = ({ resultSearchTerm, setSearchTerm }) => {
  const [selectedWord, setSelectedWord] = useState("");
  const handleToggleKeyword = (filter, isSelected) => {
    if (!isSelected) {
      setSearchTerm(filter.value);
      setSelectedWord(filter.value);
    } else {
      setSelectedWord("");
    }
  };

  if (resultSearchTerm?.trim()) {
    return null;
  }

  return (
    <>
      {getTopKeywords()?.length ? (
        <Container maxW="1300px">
          <Heading
            textAlign="center"
            fontSize={[null, null, "14px", "18px", "20px"]}
            my={4}
          >
            Top Keywords
          </Heading>
          <div className={`home-facet-container`}>
            {getTopKeywords()?.map((a, idx) => {
              const selected = selectedWord === a.value;
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
      ) : null}
    </>
  );
};

export default withSearch(({ resultSearchTerm, setSearchTerm }) => ({
  resultSearchTerm,
  setSearchTerm,
}))(KeywordsSearchSelection);
