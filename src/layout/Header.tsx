import { SearchBox } from "@elastic/react-search-ui";
import React, { useEffect } from "react";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBoxView from "../components/customSearchboxView/SearchBoxView";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import FilterIcon from "@/components/svgs/FilterIcon";

const Header = ({ openForm }) => {
  const { makeQuery } = useSearchQuery();

  const handleSubmit = (input: string) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (
    selection,
    autoCompleteData,
    defaultFunction
  ) => {
    if (!selection.suggestion) return;
    makeQuery(removeMarkdownCharacters(selection.suggestion));
  };

  return (
    <div className="flex gap-2 mx-auto max-w-3xl w-full  justify-center">
      <SearchBox
        autocompleteMinimumCharacters={3}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={handleSubmit}
        className="w-full"
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
      <button className="flex items-center bg-transparent min-h-[40px] border border-gray  px-4  rounded-xl  md:hidden">
        <FilterIcon />
      </button>
    </div>
  );
};

export default React.memo(Header);
