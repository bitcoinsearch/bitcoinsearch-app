import React, { FormEvent, useEffect, useRef, useState } from "react";
import Downshift from "downshift";

import type {
  AutocompleteResult,
  AutocompleteSuggestion,
  SearchContextState,
} from "@elastic/search-ui";
import {
  BaseContainerProps,
  SearchBoxAutocompleteViewProps,
  InputViewProps,
} from "@elastic/react-search-ui-views";
import useSearchQuery from "@/hooks/useSearchQuery";
import SearchIcon from "../svgs/SearchIcon";
import CloseIconOutlined from "../svgs/CloseIconOutlined";
import { defaultSearchTags } from "@/utils/dummy";
import { isMac } from "@/utils/userOS";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";

export type SearchBoxContainerContext = Pick<
  SearchContextState,
  | "autocompletedResults"
  | "autocompletedSuggestions"
  | "searchTerm"
  | "setSearchTerm"
  | "trackAutocompleteClickThrough"
  | "trackAutocompleteSuggestionClickThrough"
>;

export type SearchBoxContainerProps = BaseContainerProps &
  SearchBoxContainerContext & {
    view?: React.ComponentType<SearchBoxViewProps>;
    autocompleteView?: React.ComponentType<SearchBoxAutocompleteViewProps>;
    inputView?: React.ComponentType<InputViewProps>;
    autocompleteMinimumCharacters?: number;
    autocompleteResults?: AutocompleteResult | boolean;
    autocompleteSuggestions?: boolean | AutocompleteSuggestion;
    shouldClearFilters?: boolean;
    debounceLength?: number;
    inputProps?: any;
    onSelectAutocomplete?: any;
    onSubmit?: (searchTerm: string) => void;
    searchAsYouType?: boolean;
  };

export type SearchBoxViewProps = BaseContainerProps &
  Pick<
    SearchBoxContainerProps,
    | "autocompleteView"
    | "inputView"
    | "autocompleteSuggestions"
    | "autocompleteResults"
    | "autocompleteSuggestions"
    | "autocompletedResults"
    | "autocompletedSuggestions"
  > & {
    allAutocompletedItemsCount: number;
    autocompletedSuggestionsCount: any;
    completeSuggestion: (searchQuery: string) => void;
    isFocused: boolean;
    notifyAutocompleteSelected: (selection: any) => void;
    onChange: (value: string) => void;
    onSelectAutocomplete: any;
    onSubmit: (e: FormEvent) => void;
    useAutocomplete: boolean;
    value: string;
    inputProps: any;
  };

function SearchBoxView(props: SearchBoxViewProps) {
  const {
    className,
    allAutocompletedItemsCount,
    autocompleteView,
    isFocused,
    inputProps = { className: "" },
    inputView,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    useAutocomplete,
    value,
    // NOTE: These are explicitly de-structured but not used so that they are
    // not passed through to the input with the 'rest' parameter

    autocompletedResults,

    autocompletedSuggestions,

    autocompletedSuggestionsCount,

    completeSuggestion,

    notifyAutocompleteSelected,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement | null>();
  const searchFormRef = useRef<HTMLFormElement | null>();

  const [searchInput, setSearchInput] = useState<string>("");
  const [typed, setTyped] = useState(false);
  const [onFocus, setFocus] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [isOutsideClick, setIsOutsideClick] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const isMacDevice = isMac();
  const { getFilter, addFilter, removeFilter, getSearchTerm } = useURLManager();
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setFocus(false);
      setIsOutsideClick(true);
    } else {
      setIsOutsideClick(false);
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const handleChange = (value: string) => {
    onChange(value);
    setSearchTerm(value);
  };
  const onTabClick = (
    value: string,
    filterType: FacetKeys,
    filterValue: string
  ) => {
    setIsOutsideClick(true)
    setFocus(false)
    if (filterType) {
      if (getFilter(filterType).includes(filterValue)) {
        removeFilter({ filterType, filterValue });
      } else {
        if (filterType === "domain") {
          if (getFilter("domain")[0]) {
            removeFilter({
              filterType: "domain",
              filterValue: getFilter("domain")[0],
            });
          }
        }
        addFilter({ filterType, filterValue });
        if(!inputRef.current.value){
          handleChange(filterValue);
        }
        setIsPageLoaded(true);
        makeQuery(filterValue);
      }
      return;
    }
    setIsPageLoaded(true);
    handleChange(value)
    makeQuery(value);
  };
  const onClearInput = () => {
    inputRef.current.value = "";
    handleChange("");
    setTyped(false);
    setSearchInput("");
  };

  const onSearchInputChange = (value: string) => {
    setSearchInput(value);
  };
  const { searchQuery, makeQuery, queryResult } = useSearchQuery();

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  // sync autocomplete
  useEffect(() => {
    if (!searchQuery) return;
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const isContainerOpen = (onFocus && !isOutsideClick && !searchInput) || (isPageLoaded)
  const isAutoCompleteContainerOpen = 
    (searchInput && typed && allAutocompletedItemsCount && !isOutsideClick) ? true : false;
  const isShortcutVisible = !onFocus;
  const suggestions = autocompletedSuggestions?.documents || [];

  const onSelectSuggestion = (value) => {
    onSelectAutocomplete(value);
    handleChange(removeMarkdownCharacters(value.suggestion));
    setTyped(false);
  };

  useEffect(()=>{
    if(queryResult.isFetched){
      setIsPageLoaded(false)
      console.log("i entered")
    }

  },[queryResult.isFetched])
  return (
    <Downshift
      inputValue={searchTerm}
      onChange={onSelectAutocomplete}
      onInputValueChange={(newValue) => {
        handleChange(newValue);
        onSearchInputChange(newValue);
      }}
      // Because when a selection is made, we don't really want to change
      // the inputValue. This is supposed to be a "controlled" value, and when
      // this happens we lose control of it.
      itemToString={() => searchTerm}
      {...rest}
    >
      {(downshiftProps) => {
        const { closeMenu, getInputProps, isOpen } = downshiftProps;
        return (
          <form
            ref={searchFormRef}
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSubmit(e);
              setFocus(false);
              setTyped(false);
            }}
          >
            <div
              ref={searchBoxRef}
              tabIndex={0}
              className="flex  items-start w-full mx-auto max-w-3xl"
            >
              <div className="flex-col relative w-full">
                <div
                  className={`${
                    isContainerOpen || isAutoCompleteContainerOpen
                      ? "rounded-b-none rounded-tl-xl md:rounded-tl-2xl"
                      : "rounded-l-xl md:rounded-l-2xl"
                  } border-r-0   h-[48px]  w-full px-3 md:px-6 items-center justify-center border border-gray flex`}
                >
                  <input
                    ref={inputRef}
                    {...getInputProps()}
                    onKeyUp={(e) => setTyped(true)}
                    onFocus={() => {
                      setFocus(true);
                    }}
                    placeholder="Search for topics, authors or resources..."
                    className="search-box py-1.5 md:py-3 text-sm md:text-base placeholder:text-xs md:placeholder:text-base h-full placeholder:text-gray w-full border-none outline-none bg-transparent "
                  />
                  {isShortcutVisible && (
                    <p className="whitespace-nowrap hidden md:inline-block text-sm text-gray">
                      <kbd>{isMacDevice ? "⌘" : "CTRL"}</kbd> + <kbd>K</kbd> or
                      {" /"}
                    </p>
                  )}
                  {onFocus && searchInput && typed && (
                    <CloseIconOutlined
                      className="cursor-pointer w-[8px] md:w-auto"
                      onClick={onClearInput}
                    />
                  )}
                </div>
                {/* dropdown showing tags only */}

                  <div
                    className={`${isContainerOpen ?"flex" : "hidden"} border absolute max-h-[60vh] overflow-y-auto top-11.5 border-t-0 border-gray z-20 py-2.5 px-3 md:px-6 md:py-7 w-full max-w-3xl    bg-white rounded-b-2xl gap-4 md:gap-8  flex-col `}
                  >
                    {/* Each search */}
                    {defaultSearchTags.map((tagType) => (
                      <div
                        key={tagType.headline}
                        className="flex text-darkGray-300 flex-col gap-2"
                      >
                        <p className="text-sm md:text-base font-semibold">
                          {tagType.headline}
                        </p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {tagType.tags.map((tag) => (
                            <div
                              key={tag}
                              onClick={() => {
                                onTabClick(tag, tagType.type as FacetKeys, tag);
                              }}
                              className={`${
                                getFilter(tagType.type as FacetKeys).includes(
                                  tag
                                )
                                  ? "bg-[#FFF0E0]"
                                  : ""
                              }  ${
                                (searchTerm === tag)
                                  ? "bg-[#FFF0E0]"
                                  : ""
                              } px-3 py-1.5  md:py-2 md:px-4 hover:bg-[#FFF0E0] cursor-pointer text-[0.688rem] md:text-xs rounded-md md:rounded-lg border  border-gray   max-w-[max-content]`}
                            >
                              <p>{tag}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                {/* For auto complete */}
                {(isAutoCompleteContainerOpen) && (
                  <div
                    className={`border absolute top-11.5   border-t-0 border-gray z-20 overflow-hidden  w-full max-w-3xl  bg-[#FAFAFA] rounded-b-xl md:rounded-b-2xl  flex flex-col  `}
                  >
                    {suggestions.map((sug) => (
                      <p
                        key={sug.suggestion}
                        onClick={() => onSelectSuggestion(sug)}
                        className="cursor-pointer text-sm md:text-base py-3.5 px-4 md:px-6 md:py-4 hover:bg-[#FFF0E0]"
                      >
                        {removeMarkdownCharacters(sug.suggestion)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center bg-gradient-search h-[48px]  px-4 min-h-full rounded-r-xl md:rounded-r-2xl">
                <SearchIcon className="w-[16px] md:w-auto" />
              </button>
            </div>
          </form>
        );
      }}
    </Downshift>
  );
}

export default SearchBoxView;
