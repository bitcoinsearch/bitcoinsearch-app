/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Parser } from "html-to-react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch,
} from "@elastic/react-search-ui";
import {
  Layout,
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./custom.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";
import logo from "./btc.png";

const htmlToReactParser = new Parser();
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
};

const CustomPagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

const CustomResultView = ({ result, onClickLink }) => (
  <div className="searchresult">
    <h2>
      <a onClick={onClickLink} href={result.url.raw}>
        {htmlToReactParser.parse(result.title.snippet)}
      </a>
    </h2>
    <a className="url-display">
      {result.url.raw} <button>▼</button>
    </a>
    <p>{htmlToReactParser.parse(result.body.snippet)}</p>
  </div>
);

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App btc-search">
              <ErrorBoundary>
                <div className="header">
                  <img src={logo} className="logo" alt="bitcoin logo" />
                  <div>Technical Bitcoin Search</div>
                </div>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "Results",
                        titleField: "title",
                        urlField: "nps_link",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["test"],
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched}
                      {getFacetFields().map((field) => (
                        <Facet key={field} field={field} label={field} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      resultView={CustomResultView}
                      // titleField="title"
                      // urlField="nps_link"
                      // thumbnailField="image_url"
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
                      {wasSearched && <ResultsPerPage />}
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
