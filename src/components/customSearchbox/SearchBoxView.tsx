import Downshift from "downshift";
import React, { FormEvent, useEffect, useRef, useState } from "react";

import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { defaultSearchTags } from "@/utils/dummy";
import { removeMarkdownCharacters } from "@/utils/elastic-search-ui-functions";
import { isMac } from "@/utils/userOS";
import {
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
import { getDomainLabel } from "@/config/mapping-helper";
import {
  SearchBoxContainerContext,
  SearchBoxContainerProps,
} from "./SearchBox";

export type SearchBoxViewProps = Pick<
  SearchBoxContainerContext & SearchBoxContainerProps,
  | "autocompleteSuggestions"
  | "autocompleteResults"
  | "autocompletedSuggestions"
  | "autocompletedResults"
> & {
  isFocused: boolean;
  className?: string;
  allAutocompletedItemsCount: number;
  autocompletedSuggestionsCount: any;
  onChange: (value: string) => void;
  onSelectAutocomplete: any;
  onSubmit: (searchTerm: string) => void;
  useAutocomplete: boolean;
  inputProps?: any;
};

function SearchBoxView(props: SearchBoxViewProps) {
  const {
    className,
    allAutocompletedItemsCount,
    isFocused,
    inputProps = { className: "" },
    onChange,
    onSelectAutocomplete,
    onSubmit,
    useAutocomplete,
    // NOTE: These are explicitly de-structured but not used so that they are
    // not passed through to the input with the 'rest' parameter

    autocompletedResults,

    autocompletedSuggestions,

    autocompletedSuggestionsCount,

    ...rest
  } = props;

  const { searchQuery, makeQuery, queryResult } = useSearchQuery();

  const inputRef = useRef<HTMLInputElement | null>();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [searchInput, setSearchInput] = useState<string>(searchQuery);

  const [onFocus, setFocus] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const isMacDevice = isMac();

  const { getFilter, addFilter, removeFilter, clearAllFilters, toggleFilter } =
    useURLManager();

  const handleChange = (value: string) => {
    onChange(value);
    setSearchInput(value);
  };
  const onTabClick = (
    filterType: FacetKeys,
    value: string
  ) => {
    if (filterType) {
      if (filterType === "domain") {
        toggleFilter({filterType, filterValue: value, multiSelect: false})
      } else {
        toggleFilter({filterType, filterValue: value, multiSelect: true})
      }
      return
    }
    handleChange(value);
    makeQuery(value);
  };
  const onClearInput = (e) => {
    e.stopPropagation();
    inputRef.current.focus();
    handleChange("");
    setSearchInput("");
  };

  const isContainerOpen =
    (onFocus && !searchInput.trim());

  const isAutoCompleteContainerOpen =
  onFocus && (searchInput.trim().length > 2) && !!allAutocompletedItemsCount
  
  const isShortcutVisible = !onFocus;
  const suggestions = autocompletedSuggestions?.documents || [];

  const onSelectSuggestion = (value) => {
    onSelectAutocomplete(value);
    handleChange(removeMarkdownCharacters(value.suggestion));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.keyCode) {
      case 13:
        const sug = suggestions[currentIndex]
        if (sug?.["suggestion"]) {
          onSelectSuggestion(suggestions[currentIndex])
        }
        break;
      case 27:
        event.preventDefault()
        inputRef.current.blur()
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput?.trim()) {
      return;
    }
    onSubmit(searchInput);
  };

  //handle focus on container
  const handleFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    setTimeout(() => {
      setFocus(true)
    }, 200);
  }
  const handleFocusLost = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const isChildFocused = e.currentTarget.contains(e.relatedTarget);
    if (!isChildFocused) {
      setFocus(false);
    }
  }

  // quirks with mobile to dismiss keyboard
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const handleClickOutside = (event: MouseEvent) => {
      const hasChildFocus = searchBoxRef.current ? searchBoxRef?.current.querySelector(':active') !== null : false
      if (!hasChildFocus) {
        setFocus(false)
      }
    };

    const handleFocus = () => {
      // brave browser fails at retargeting the input box after shift the delay helps
      setTimeout(() => {
        setFocus(true)
      }, 200);
    }

    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleClickOutside);

    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleClickOutside);
    };
  }, []);

  return (
    <Downshift
      inputValue={searchInput}
      onChange={onSelectAutocomplete}
      onInputValueChange={(newValue) => {
        handleChange(newValue);
      }}
      // Because when a selection is made, we don't really want to change
      // the inputValue. This is supposed to be a "controlled" value, and when
      // this happens we lose control of it.
      // itemToString={() => searchTerm}
      itemToString={() => searchInput}
      {...rest}
    >
      {(downshiftProps) => {
        const { getInputProps } = downshiftProps;
        return (
          <form
            className="w-full peer/search group/search"
            data-input-focus={onFocus}
            onSubmit={(e) => handleSubmit(e)}
          >
            <div
              ref={searchBoxRef}
              tabIndex={0}
              className={`${onFocus ? 'popout' : ''} search_box_view-box flex items-start w-full`}
              onKeyDown={handleKeyDown}
              onFocus={(e) => handleFocus(e)}
              onBlur={(e) => handleFocusLost(e)}
            >
              <div className="flex-col relative w-full">
                <div
                  className={`${
                    isContainerOpen || isAutoCompleteContainerOpen
                      ? "rounded-b-none rounded-tl-lg md:rounded-tl-[14px] group-data-[input-focus='true']/search:rounded-tr-lg group-data-[input-focus='true']/search:md:rounded-tr-none"
                      : "rounded-l-xl md:rounded-l-[14px] group-data-[input-focus='true']/search:rounded-r-lg group-data-[input-focus='true']/search:md:rounded-r-none"
                  } 
                  border-r-0 group-data-[input-focus='true']/search:border-r group-data-[input-focus='true']/search:md:border-r-0 h-[48px] 2xl:h-[66px] w-full px-3 md:px-6 bg-custom-background border border-custom-stroke flex`}
                >
                  <input
                    ref={inputRef}
                    {...getInputProps()}
                    inputMode="search"
                    placeholder="Search for topics, authors or resources..."
                    className="search_box_view-input 2xl:text-xl text-custom-primary-text font-medium placeholder:text-custom-secondary-text search-box py-1.5 md:py-3 md:text-base placeholder:text-[14px] md:placeholder:text-base h-full w-full border-none outline-none bg-transparent"
                    onFocus={handleFocus}
                  />
                  {isShortcutVisible && (
                    <p className="font-geist whitespace-nowrap bg-transparent hidden md:inline-block text-sm text-custom-stroke dark:text-custom-primary-text self-center">
                      <kbd className="font-geist">
                        {isMacDevice ? "⌘" : "CTRL"}
                      </kbd>{" "}
                      + <kbd className="font-geist">K</kbd> or
                      {" /"}
                    </p>
                  )}
                  {onFocus && !!searchInput.trim() && (
                    <button type="button" onClick={onClearInput} className="mx-2 grid place-items-center">
                      <CloseIconOutlined
                        className="cursor-pointer w-[20px] md:w-auto"
                        role="button"
                      />
                    </button>
                  )}
                </div>
                {/* dropdown showing tags only */}

                <div
                  className={`${
                    isContainerOpen ? "flex" : "hidden"
                  } flex-col border gap-4 md:gap-6 2xl:gap-8 absolute max-h-[50svh] text-left overflow-y-auto top-11.5 border-t-0 border-custom-stroke z-[60] py-2.5 px-3 md:px-6 md:py-7 w-full bg-custom-background rounded-b-2xl`}
                >
                  {/* Each search */}
                  {defaultSearchTags.map((tagType) => (
                    <div
                      key={tagType.headline}
                      className="flex text-sm text-custom-primary-text flex-col gap-2"
                    >
                      <p className="text-sm md:text-base font-semibold">
                        {tagType.headline}
                      </p>
                      <div className="flex flex-wrap gap-2 h-[34px] md:h-[40px] overflow-clip">
                        {tagType.tags.map((tag) => (
                          <div
                            key={tag}
                            onClick={() => {
                              onTabClick(tagType.type as FacetKeys, tag);
                            }}
                            className={`${
                              getFilter(tagType.type as FacetKeys).includes(tag)
                                ? "bg-custom-hover-state"
                                : ""
                            }  ${
                              searchInput === tag ? "bg-custom-hover-state" : ""
                            } px-3 py-1.5 md:py-2 md:px-4 hover:bg-custom-hover-state cursor-pointer rounded-md md:rounded-lg border border-custom-stroke  max-w-[max-content]`}
                          >
                            <p className="capitalize">
                              {tagType.type === "domain"
                                ? getDomainLabel(tag)
                                : tag}
                            </p>
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
                    className={`border absolute top-11.5 text-left bg-custom-background border-t-0 border-custom-stroke z-20 overflow-hidden  w-full   rounded-b-xl md:rounded-b-2xl  flex flex-col  `}
                  >
                    <ul>
                      {suggestions.map((sug, index) => (
                        <li
                          key={sug.suggestion}
                          tabIndex={0}
                          data-navigated={currentIndex === index}
                          onClick={() => onSelectSuggestion(sug)}
                          className={`
                          data-[navigated='true']:bg-custom-hover-state
                          outline-none cursor-pointer text-custom-primary-text text-sm md:text-base py-3.5 px-4 md:px-6 md:py-4 hover:bg-custom-hover-state`}
                        >
                          {removeMarkdownCharacters(sug.suggestion)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button className="group-data-[input-focus='true']/search:hidden group-data-[input-focus='true']/search:md:flex md:flex items-center bg-gradient h-[48px] 2xl:h-[66px] px-4 2xl:px-[27px] min-h-full rounded-r-lg md:rounded-r-[14px]">
                <SearchIcon className="text-custom-background w-[14px] md:w-[18px] 2xl:w-[24px] h-auto" />
              </button>
            </div>
          </form>
        );
      }}
    </Downshift>
  );
}

export default SearchBoxView;
