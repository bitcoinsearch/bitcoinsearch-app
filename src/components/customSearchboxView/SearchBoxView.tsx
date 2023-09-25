import React, { FormEvent, useEffect, useState } from "react";
import Downshift from "downshift";

import { Autocomplete } from "@elastic/react-search-ui-views";

import type {
  AutocompleteResult,
  AutocompleteSuggestion,
  SearchContextState
} from "@elastic/search-ui";
import {
  BaseContainerProps,
  SearchBoxAutocompleteViewProps,
  InputViewProps
} from "@elastic/react-search-ui-views";
import useSearchQuery from "@/hooks/useSearchQuery";
import appendClassName from "@/utils/elastic-search-ui-functions";

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
  const { searchQuery, makeQuery } = useSearchQuery();
  const focusedClass = isFocused ? "focus" : "";
  const AutocompleteView = Autocomplete;
  const InputView = inputView;

  const [searchTerm, setSearchTerm] = useState(searchQuery)

  // sync autocomplete
  useEffect(() => {
    if (!searchQuery) return
    setSearchTerm(searchQuery)
  }, [searchQuery])

  const handleChange = (value: string) => {
    onChange(value)
    setSearchTerm(value)
  }

  return (
    <Downshift
      inputValue={searchTerm}
      onChange={onSelectAutocomplete}
      onInputValueChange={(newValue) => {
        // To avoid over dispatching
        // if (value === newValue) return;
        // onChange(newValue);
        handleChange(newValue);
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
        return (
          <form
            onSubmit={(e) => {
              closeMenu();
              onSubmit(e);
            }}
          >
            <div
              className={
                appendClassName("sui-search-box", className) + autocompleteClass
              }
            >
              <InputView
                {...downshiftProps}
                getInputProps={(additionalProps) => {
                  const { className, ...rest } = additionalProps || {};
                  return getInputProps({
                    "data-transaction-name": "search input",
                    placeholder: "Search",
                    ...inputProps,
                    className: appendClassName("sui-search-box__text-input", [
                      inputProps.className,
                      className,
                      focusedClass
                    ]),
                    ...rest
                  });
                }}
                getButtonProps={(additionalProps) => {
                  const { className, ...rest } = additionalProps || {};
                  return {
                    "data-transaction-name": "search submit",
                    type: "submit",
                    value: "Search",
                    className: appendClassName(
                      "button sui-search-box__submit",
                      className
                    ),
                    ...rest
                  };
                }}
                getAutocomplete={() => {
                  if (
                    useAutocomplete &&
                    isOpen &&
                    allAutocompletedItemsCount > 0
                  ) {
                    return <AutocompleteView {...props} {...downshiftProps} />;
                  } else {
                    return null;
                  }
                }}
              />
            </div>
          </form>
        );
      }}
    </Downshift>
  );
}

export default SearchBoxView;
