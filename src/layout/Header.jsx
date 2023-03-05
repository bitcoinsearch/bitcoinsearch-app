import { SearchBox } from "@elastic/react-search-ui";
import React from "react";
import SearchInput from "../components/customSearchboxView/SearchInput";
import HomeFacetSelection from "../components/homeFacetSelection";
import KeywordsSelection from "../components/homeFacetSelection/KeywordsSelection";

// const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection)
const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection);

const Header = ({ openForm }) => {
  const SearchInputWrapper = ({ ...rest }) => {
    return <SearchInput openForm={openForm} {...rest} />;
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
      />
      <MemoizedHomeFacetSelection />
      <KeywordsSelection />
    </>
  );
};

export default React.memo(Header);
