import { SearchBox } from "@elastic/react-search-ui";
import React, { useEffect } from "react";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBoxView from "../components/customSearchboxView/SearchBoxView";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import FilterIcon from "@/components/svgs/FilterIcon";
import useUIContext from "@/hooks/useUIContext";

const Header = ({ openForm }) => {
  const { makeQuery, filterFields } = useSearchQuery();
  const { sidebarToggleManager } = useUIContext();

  const numberOfAppliedFilters = filterFields.length;

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
    <div className="flex gap-2 mx-auto max-w-3xl w-full justify-center">
      <SearchBox
        autocompleteMinimumCharacters={3}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={handleSubmit}
        className="w-full"
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
      <div className="relative md:hidden peer-data-[input-focus='true']/search:hidden">
        <button
          onClick={() => sidebarToggleManager.updater(true)}
          className="flex items-center justify-center bg-transparent min-h-[48px] w-[48px] border border-gray rounded-xl"
        >
          <FilterIcon />
        </button>
        {Boolean(numberOfAppliedFilters) && (
          <div className="absolute -top-1 -right-1 rounded-full w-4 h-4 text-[11px] font-black leading-none">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{numberOfAppliedFilters}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Header);
