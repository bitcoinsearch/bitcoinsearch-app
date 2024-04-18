import FilterIcon from "@/components/svgs/FilterIcon";
import useUIContext from "@/hooks/useUIContext";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import React from "react";
import SearchBoxView from "../components/customSearchbox/SearchBoxView";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBox from "@/components/customSearchbox/SearchBox";

const Header = ({ openForm }) => {
  const { sidebarToggleManager } = useUIContext();
  const { makeQuery, filterFields, pagingInfo } = useSearchQuery();

  const numberOfAppliedFilters = filterFields.length;

  const handleSubmit = (input: string) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (
    selection
  ) => {
    if (!selection.suggestion) return;
    makeQuery(removeMarkdownCharacters(selection.suggestion));
  };

  return (
    <div className="flex pt-10 md:pt-0 gap-2 mx-auto max-w-3xl w-full justify-center bg-custom-background">
      <SearchBox
        autocompleteMinimumCharacters={3}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={handleSubmit}
        className="w-full"
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
      <div data-has-results={pagingInfo.totalResults > 0} className="relative data-[has-results='false']:hidden md:hidden peer-data-[input-focus='true']/search:hidden">
        <button
          onClick={() => sidebarToggleManager.updater(true)}
          className="flex items-center justify-center bg-transparent min-h-[48px] w-[48px] border border-custom-stroke rounded-xl"
        >
          <FilterIcon className="text-custom-primary-text" />
        </button>
        {Boolean(numberOfAppliedFilters) && (
          <div className="absolute -top-1 -right-1 rounded-full w-4 h-4 text-[11px] font-black leading-none">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {numberOfAppliedFilters}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Header);
