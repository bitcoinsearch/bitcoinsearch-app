import { SearchBox } from "@elastic/react-search-ui";
import React, { useEffect } from "react";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBoxView from "../components/customSearchboxView/SearchBoxView"
import { InputViewProps } from "@elastic/react-search-ui-views";

const Header = ({openForm}) => {
  useEffect(() => {
  }, [])
  const { makeQuery } = useSearchQuery();

  const handleSubmit = (input: string) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (selection, autoCompleteData, defaultFunction) => {
    if (!selection.suggestion) return;
    makeQuery(selection.suggestion);
  };

  return (
      <SearchBox
        autocompleteMinimumCharacters={3}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={handleSubmit}
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
  );
};

export default React.memo(Header);
