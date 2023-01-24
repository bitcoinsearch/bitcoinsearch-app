import * as React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  Paging,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./custom.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
  getFacetFields,
  getFacetWithSearch,
} from "./config/config-helper";
import logo from "./btc.png";
import CustomMultiCheckboxFacet from "./components/customMultiCheckboxFacet/CustomMultiCheckboxFacet";
import { useSearchFocusHotkey } from "./hooks/useGlobalHotkey";
import CustomResultView from "./components/customResultView/CustomResultView";

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
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
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
                    <Results
                      resultView={CustomResultView}
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().thumbnailField}
                      shouldTrackClickThrough={true}
                    />
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
  );
}
