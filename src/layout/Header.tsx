import FilterIcon from "@/components/svgs/FilterIcon";
import useUIContext from "@/hooks/useUIContext";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import React from "react";
import SearchBoxView from "../components/customSearchbox/SearchBoxView";
import useSearchQuery from "../hooks/useSearchQuery";
import SearchBox from "@/components/customSearchbox/SearchBox";
import FilterCloseIcon from "@/components/svgs/FilterCloseIcon";

const Header = ({ openForm }) => {
  const { sidebarToggleManager } = useUIContext();
  const { makeQuery, filterFields, pagingInfo } = useSearchQuery();

  const numberOfAppliedFilters = filterFields.length;

  const handleSubmit = (input: string) => {
    makeQuery(input);
  };

  const handleAutoCompleteSelect = (selection) => {
    if (!selection.suggestion) return;
    makeQuery(removeMarkdownCharacters(selection.suggestion));
  };

  return (
    <div className="flex md:pt-0 gap-2 mx-auto max-w-3xl 2xl:max-w-[960px] w-full justify-center bg-custom-background">
      <SearchBox
        autocompleteMinimumCharacters={3}
        view={SearchBoxView}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={handleSubmit}
        className="w-full"
        onSelectAutocomplete={handleAutoCompleteSelect}
      />
      <div
        data-has-results={pagingInfo.totalResults > 0}
        className="relative data-[has-results='false']:hidden md:hidden peer-data-[input-focus='true']/search:hidden"
      >
        <button
          onClick={() => sidebarToggleManager.updater(!sidebarToggleManager.state)}
          className="flex items-center justify-center bg-transparent min-h-[48px] w-[48px] border border-custom-stroke rounded-xl"
        >
          {sidebarToggleManager.state ? (
            <FilterCloseIcon className="text-custom-accent w-[16px] ml-[2px]" />
          ) : (
            <FilterIcon className="text-custom-primary-text" />
          )}
        </button>
        {Boolean(numberOfAppliedFilters) && (
          <div className="absolute -top-1 -right-1 rounded-full w-4 h-4 text-[11px] font-black bg-custom-accent leading-none">
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
