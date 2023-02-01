import * as React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  PagingInfo,
  Paging,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// CSS/ASSETS //
import "./custom.scss";
import { ChakraProvider } from "@chakra-ui/react";
import logo from "./btc.png";

// CONFIG //
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
  getFacetFields,
  getFacetWithSearch,
} from "./config/config-helper";

// COMPONENTS //
import { useState } from "react";
import CustomMultiCheckboxFacet from "./components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import CustomResults from "./components/customResults/CustomResults";
import { useSearchFocusHotkey } from "./hooks/useGlobalHotkey";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: false,
  initialState: { resultsPerPage: 50 },
};

const CustomPagingInfoView = ({ totalResults }) => {
  const totalResultsFormatted =
    new Intl.NumberFormat().format(totalResults) ?? "N/A";
  return (
    <div className="paging-info">
      <strong>{totalResultsFormatted}</strong>
      <p>results</p>
    </div>
  );
};

export default function App() {
  useSearchFocusHotkey();

  return (
    <ChakraProvider>
      <SearchProvider config={config}>
        <WithSearch
          mapContextToProps={({ wasSearched, results }) => ({
            wasSearched,
            results,
          })}
        >
          {({ wasSearched, results }) => {
            return (
              <div className="App btc-search">
                <ErrorBoundary>
                  <div className="header">
                    <img src={logo} className="logo" alt="bitcoin logo" />
                    <p className="description">Technical Bitcoin Search</p>
                  </div>
                  <Layout
                    header={
                      <SearchBox
                        autocompleteMinimumCharacters={3}
                        // autocompleteResults={{
                        //   linkTarget: "_blank",
                        //   sectionTitle: "Suggested Queries",
                        //   titleField: "title",
                        //   urlField: "nps_link",
                        //   shouldTrackClickThrough: true,
                        //   clickThroughTags: ["test"],
                        // }}
                        autocompleteSuggestions={true}
                        debounceLength={0}
                      />
                    }
                    sideContent={
                      <div>
                        {wasSearched}
                        {getFacetFields().map((field) => (
                          <Facet
                            key={field}
                            field={field}
                            isFilterable={getFacetWithSearch().includes(field)}
                            label={field}
                            view={CustomMultiCheckboxFacet}
                          />
                        ))}
                      </div>
                    }
                    bodyContent={
                      <CustomResults shouldTrackClickThrough={true} />
                    }
                    bodyHeader={
                      <>
                        {wasSearched && (
                          <PagingInfo view={CustomPagingInfoView} />
                        )}
                      </>
                    }
                    bodyFooter={<Paging />}
                  />
                </ErrorBoundary>
              </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
    </ChakraProvider>
  );
}
