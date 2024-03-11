import { SearchBox } from "@elastic/react-search-ui";
import React, { useEffect } from "react";
import SearchInput from "../components/customSearchboxView/SearchInput";
import HomeFacetSelection from "../components/homeFacetSelection";
import KeywordsSelection from "../components/homeFacetSelection/KeywordsSelection";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBoxView from "../components/customSearchboxView/SearchBoxView"
import { InputViewProps } from "@elastic/react-search-ui-views";
import SearchBoxNew from "@/components/customSearchboxView/SearchBoxNew";

const Header = ({openForm}) => {
  useEffect(() => {
  }, [])
  const { makeQuery } = useSearchQuery();
  const SearchInputWrapper = ({ ...rest }: InputViewProps) => {
    return <SearchInput openForm={openForm} {...rest} />;
  };

  const handleSubmit = (input: string) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (selection, autoCompleteData, defaultFunction) => {
    if (!selection.suggestion) return;
    makeQuery(selection.suggestion);
  };

  return (
    <>
      {/* <SearchBox
        autocompleteMinimumCharacters={3}
        // autocompleteResults={{
        //   linkTarget: "_blank",
        //   sectionTitle: "Suggested Queries",
        //   titleField: "title",
        //   urlField: "nps_link",
        //   shouldTrackClickThrough: true,
        //   clickThroughTags: ["test"],
        // }}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        inputView={SearchInputWrapper}
        onSubmit={handleSubmit}
        onSelectAutocomplete={handleAutoCompleteSelect}
      /> */}
      <SearchBoxNew />
      <HomeFacetSelection />
      <KeywordsSelection />
    </>
  );
};

export default React.memo(Header);
