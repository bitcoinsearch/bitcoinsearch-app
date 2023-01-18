import * as React from "react";
import { Parser } from "html-to-react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import sanitizeHtml from "sanitize-html";

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
import CustomMultiCheckboxFacet from "./components/CustomMultiCheckboxFacet";
import useGlobalHotkey from "./hooks/useGlobalHotkey";
import getHotkeys from "./config/hotkeys";

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

const CustomResultView = ({ result, onClickLink }) => {
  return (
    <div className="searchresult">
      <h2>
        <a onClick={onClickLink} href={result.url.raw}>
          {htmlToReactParser.parse(sanitizeHtml(result.title.snippet))}
        </a>
      </h2>
      <p className="url-display">{result.url.raw}</p>
      <p>
        {htmlToReactParser.parse(
          sanitizeHtml(
            (result.body_type.raw === "raw"
              ? result.body.raw
              : JSON.parse(`[${result.body.raw}]`)
                  .map((i) => i.text)
                  .join(" ")
            ).replaceAll("\n", "")
          )
            .substring(0, 300)
            .trim()
        )}
      </p>

      {result.authors && (
        <div className="authors">
          {result.authors.raw.map((a, idx) => (
            <span key={`${a}_${idx}`} className="authors-label">
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  useGlobalHotkey({ hotkeys: getHotkeys() });

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