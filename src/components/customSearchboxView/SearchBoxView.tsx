import React, { FormEvent, useEffect, useRef, useState } from "react";
import Downshift from "downshift";

import { Autocomplete } from "@elastic/react-search-ui-views";

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
import appendClassName from "@/utils/elastic-search-ui-functions";
import SearchIcon from "../svgs/SearchIcon";
import CloseIconOutlined from "../svgs/CloseIconOutlined";
import { defaultSearchTags } from "@/utils/dummy";

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
  const [searchInput, setSearchInput] = useState<string>("");
  const [typed, setTyped] = useState(false);
  const [onFocus, setFocus] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
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
  const onTabClick = (value: string) => {
    inputRef.current.value = value;
    handleChange(value);
    setIsOutsideClick(true);
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
  const {searchQuery} = useSearchQuery();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  // sync autocomplete
  useEffect(() => {
    if (!searchQuery) return;
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const suggestions = autocompletedSuggestions?.documents || [];
  const onSelectSuggestion = (value) => {
    onSelectAutocomplete(value);
    setTyped(false);
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
        const { closeMenu, getInputProps, isOpen } = downshiftProps;
        const autocompleteClass = isOpen === true ? " autocomplete" : "";
        console.log(downshiftProps)
        return (
          <form
            onSubmit={(e) => {
              closeMenu();
              onSubmit(e);
            }}
          >
            <div
              ref={searchBoxRef}
              tabIndex={0}
              className="flex  items-start w-full mx-auto max-w-3xl"
            >
              <div className="flex-col w-full">
                <div
                  className={`${
                    onFocus && !isOutsideClick
                      ? "rounded-b-none rounded-tl-2xl"
                      : "rounded-l-2xl"
                  } border-r-0  h-full  w-full px-6 items-center border border-light_gray flex`}
                >
                  <input
                    ref={inputRef}
                    {...getInputProps()}
                    onKeyUp={(e) => setTyped(true)}
                    onFocus={() => {
                      setFocus(true);
                    }}
                    placeholder="Search for topics, authors or resources..."
                    className="search-box h-full placeholder:text-light_gray w-full border-none outline-none bg-transparent py-3"
                  />
                  {!(onFocus && !isOutsideClick) && (
                    <p className="whitespace-nowrap text-sm text-light_gray">
                      {" "}
                      Ctrl + K
                    </p>
                  )}
                  {searchInput && typed && (
                    <CloseIconOutlined
                      className="cursor-pointer"
                      onClick={onClearInput}
                    />
                  )}
                </div>
                {/* dropdown showing tags only */}
                {onFocus && !isOutsideClick && !searchInput && (
                  <div
                    className={`border border-t-0 border-light_gray z-20 px-6 py-7 w-full max-w-3xl max- min-h-[367px]  bg-white rounded-b-2xl gap-8 flex flex-col `}
                  >
                    {/* Each search */}
                    {defaultSearchTags.map((tagType) => (
                      <div
                        key={tagType.headline}
                        className="flex text-dark flex-col gap-2"
                      >
                        <p className=" font-semibold">{tagType.headline}</p>
                        <div className="flex flex-wrap gap-2">
                          {tagType.tags.map((tag) => (
                            <div
                              key={tag}
                              onClick={() => onTabClick(tag)}
                              className="py-2 hover:bg-[#FFF0E0] cursor-pointer text-xs rounded-lg border border-light_gray  px-4 max-w-[max-content]"
                            >
                              <p>{tag}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* For auto complete */}
                {searchInput && typed && useAutocomplete && (
                  <div
                    className={`border border-t-0 border-light_gray z-20 overflow-hidden  w-full max-w-3xl  bg-[#FAFAFA] rounded-b-2xl  flex flex-col  `}
                  >
                    {suggestions.map((sug) => (
                      <p
                        key={sug.suggestion}
                        onClick={() => onSelectSuggestion(sug)}
                        className="cursor-pointer px-6 py-4 hover:bg-[#FFF0E0]"
                      >
                        {sug.suggestion}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center bg-gradient-search h-[45px] px-4 min-h-full rounded-r-2xl">
                <SearchIcon />
              </button>
            </div>
          </form>
        );
      }}
    </Downshift>
  );
}

export default SearchBoxView;
