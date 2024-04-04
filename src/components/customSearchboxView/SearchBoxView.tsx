import Downshift from "downshift";
import React, { FormEvent, useEffect, useRef, useState } from "react";

import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { defaultSearchTags } from "@/utils/dummy";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import { isMac } from "@/utils/userOS";
import {
  BaseContainerProps,
  InputViewProps,
  SearchBoxAutocompleteViewProps,
} from "@elastic/react-search-ui-views";
import type {
  AutocompleteResult,
  AutocompleteSuggestion,
  SearchContextState,
} from "@elastic/search-ui";
import CloseIconOutlined from "../svgs/CloseIconOutlined";
import SearchIcon from "../svgs/SearchIcon";

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
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [typed, setTyped] = useState(false);
  const [onFocus, setFocus] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [isOutsideClick, setIsOutsideClick] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const isMacDevice = isMac();
  const currentItemRef = useRef<HTMLLIElement | null>(null);

  const { getFilter, addFilter, removeFilter, clearAllFilters } =
    useURLManager();
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setFocus(false);
      setIsOutsideClick(true);
      setCurrentIndex(-1);
      setIsPageLoaded(false);
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
    if (isOutsideClick) {
      setIsOutsideClick(false);
    }
    onChange(value);
    setSearchTerm(value);
  };
  const onTabClick = (
    value: string,
    filterType: FacetKeys,
    filterValue: string
  ) => {
    setIsOutsideClick(true);
    setFocus(false);
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
        if (!inputRef.current.value) {
          handleChange(filterValue);
        }
        setIsPageLoaded(true);
        makeQuery(filterValue);
      }
      return;
    }
    setIsPageLoaded(true);
    handleChange(value);
    makeQuery(value);
  };
  const onClearInput = (e) => {
    e.stopPropagation();
    inputRef.current.focus();
    setFocus(true);
    setIsOutsideClick(false);
    setSearchInput("");
    handleChange("");
    clearAllFilters();
  };

  const onSearchInputChange = (value: string) => {
    setSearchInput(value);
  };
  const { searchQuery, makeQuery, queryResult } = useSearchQuery();
  //  used to check if it's the same query that has been cached  being made by the client
  const isQueryChanged = queryResult.data?.hits?.max_score || 0;
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  // sync autocomplete
  useEffect(() => {
    if (!searchQuery) return;
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const isContainerOpen =
    (onFocus && !isOutsideClick && !searchInput) || isPageLoaded;

  const isAutoCompleteContainerOpen =
    searchInput && typed && allAutocompletedItemsCount && !isOutsideClick
      ? true
      : false;
  const isShortcutVisible = !onFocus;
  const suggestions = autocompletedSuggestions?.documents || [];

  const onSelectSuggestion = (value) => {
    onSelectAutocomplete(value);
    handleChange(removeMarkdownCharacters(value.suggestion));
    setTyped(false);
  };

  // Effect to focus on the current item whenever currentIndex changes
  useEffect(() => {
    if (currentItemRef.current) {
      currentItemRef.current.focus();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (queryResult.isFetched) {
      setIsPageLoaded(false);
    }
  }, [queryResult.isFetched, isQueryChanged]);

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 27:
        setIsOutsideClick(true);
        break;
      case 38:
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
        );
        break;
      case 40:
        setCurrentIndex((prevIndex) =>
          prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
        );
        break;
      default:
        break;
    }
  };

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
        const { getInputProps } = downshiftProps;
        return (
          <form
            ref={searchFormRef}
            className="w-full peer/search"
            data-input-focus={onFocus}
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
              className="flex  items-start w-full "
              onKeyDown={handleKeyDown}
            >
              <div className="flex-col relative w-full">
                <div
                  className={`${
                    isContainerOpen || isAutoCompleteContainerOpen
                      ? "rounded-b-none rounded-tl-xl md:rounded-tl-2xl"
                      : "rounded-l-xl md:rounded-l-2xl"
                  } border-r-0   h-[48px]  w-full px-3 md:px-6 items-center justify-center bg-custom-background border border-custom-stroke flex`}
                >
                  <input
                    ref={inputRef}
                    {...getInputProps()}
                    onKeyUp={() => {
                      setFocus(true);
                    }}
                    onKeyDown={(e) => {
                      e.code === "Enter" ? setTyped(false) : setTyped(true);
                    }}
                    onFocus={() => {
                      setFocus(true);
                      setIsOutsideClick(false);
                    }}
                    placeholder="Search for topics, authors or resources..."
                    className="text-custom-primary-text dark:text-custom-secondary-text search-box py-1.5 md:py-3 text-sm md:text-base placeholder:text-xs md:placeholder:text-base h-full placeholder:text-custom-stroke w-full border-none outline-none bg-transparent "
                  />
                  {isShortcutVisible && (
                    <p className="whitespace-nowrap bg-transparent hidden md:inline-block text-sm text-custom-stroke">
                      <kbd>{isMacDevice ? "⌘" : "CTRL"}</kbd> + <kbd>K</kbd> or
                      {" /"}
                    </p>
                  )}
                  {onFocus && typed && searchInput && (
                    <CloseIconOutlined
                      className="cursor-pointer w-[8px] md:w-auto"
                      onClick={onClearInput}
                    />
                  )}
                </div>
                {/* dropdown showing tags only */}

                <div
                  className={`${
                    isContainerOpen ? "flex" : "hidden"
                  } border absolute max-h-[60vh] overflow-y-auto top-11.5 border-t-0 border-custom-stroke z-[60] py-2.5 px-3 md:px-6 md:py-7 w-full max-w-3xl bg-custom-background rounded-b-2xl gap-4 md:gap-8  flex-col `}
                >
                  {/* Each search */}
                  {defaultSearchTags.map((tagType) => (
                    <div
                      key={tagType.headline}
                      className="flex text-custom-primary-text flex-col gap-2"
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
                              getFilter(tagType.type as FacetKeys).includes(tag)
                                ? "bg-custom-hover-state"
                                : ""
                            }  ${
                              searchTerm === tag ? "bg-custom-hover-state" : ""
                            } px-3 py-1.5  md:py-2 md:px-4 hover:bg-custom-hover-state cursor-pointer text-[0.688rem] md:text-xs rounded-md md:rounded-lg border border-custom-stroke  max-w-[max-content]`}
                          >
                            <p>{tag}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* For auto complete */}
                {isAutoCompleteContainerOpen && (
                  <div
                    role="presentation"
                    tabIndex={0}
                    className={`border absolute top-11.5 text-left   border-t-0 border-custom-grey-light z-20 overflow-hidden  w-full max-w-3xl  bg-[#FAFAFA] rounded-b-xl md:rounded-b-2xl  flex flex-col  `}
                  >
                    <ul>
                      {suggestions.map((sug, index) => (
                        <li
                          key={sug.suggestion}
                          tabIndex={0}
                          ref={currentIndex === index ? currentItemRef : null}
                          onClick={() => onSelectSuggestion(sug)}
                          onKeyDown={(e) =>
                            e.code === "Enter" && onSelectSuggestion(sug)
                          }
                          className={`
                          focus:bg-custom-hover-state
                          outline-none cursor-pointer text-sm md:text-base py-3.5 px-4 md:px-6 md:py-4 hover:bg-custom-hover-state`}
                        >
                          {removeMarkdownCharacters(sug.suggestion)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button className="flex items-center bg-gradient h-[48px]  px-4 min-h-full rounded-r-xl md:rounded-r-2xl">
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
