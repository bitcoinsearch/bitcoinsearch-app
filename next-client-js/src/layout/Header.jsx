import { SearchBox } from "@elastic/react-search-ui";
import React, { useEffect } from "react";
import SearchInput from "../components/customSearchboxView/SearchInput";
import HomeFacetSelection from "../components/homeFacetSelection";
import KeywordsSelection from "../components/homeFacetSelection/KeywordsSelection";
import useSearchQuery from "../hooks/useSearchQuery";

// const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection)
const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection);

const Header = ({openForm}) => {
  useEffect(() => {
    console.log("Header random");
  }, [])
  const { makeQuery } = useSearchQuery();
  const SearchInputWrapper = ({ ...rest }) => {
    return <SearchInput openForm={openForm} {...rest} />;
  };

  const handleSubmit = (input) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (selection, autoCompleteData, defaultFunction) => {
    if (!selection.suggestion) return;
    makeQuery(selection.suggestion);
  };

  return (
    <>
      <SearchBox
        autocompleteMinimumCharacters={3}
        // autocompleteResults={{
        //   linkTarget: "_blank",
        //   sectionTitle: "Suggested Queries",
        //   titleField: "title",
        //   urlField: "nps_link",
        //   shouldTrackClickThrough: true,
        //   clickThroughTags: ["test"],
        // }}
        autocompleteSuggestions={true}
        debounceLength={0}
        inputView={SearchInputWrapper}
        onSubmit={handleSubmit}
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
      <MemoizedHomeFacetSelection />
      <KeywordsSelection />
    </>
  );
};

export default React.memo(Header);
