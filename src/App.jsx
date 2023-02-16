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
  Sorting,
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
import NoResults from "./components/noResultsCard/NoResults";
import FormModal from "./components/formModal/FormModal";
import SearchInput from "./components/customSearchboxView/SearchInput";
import { useEffect } from "react";
import { useRef } from "react";
import LoadingBar from "./components/loadingBar/LoadingBar";

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

const ScrollTop = ({ current }) => {
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [current]);
  return null;
};

export default function App() {
  useSearchFocusHotkey();
  const [modalOpen, setModalOpen] = useState(false);

  const openForm = () => {
    setModalOpen(true);
  };
  const closeForm = () => {
    setModalOpen(false);
  };

  const SearchInputWrapper = ({ ...rest }) => {
    return <SearchInput openForm={openForm} {...rest} />;
  };

  return (
    <ChakraProvider>
      <SearchProvider config={config}>
        <WithSearch
          mapContextToProps={({
            wasSearched,
            results,
            current,
            isLoading,
          }) => ({
            wasSearched,
            results,
            current,
            isLoading,
          })}
        >
          {({ wasSearched, results, current, isLoading }) => {
            return (
              <div className="App btc-search">
                <ErrorBoundary>
                  <ScrollTop current={current} />
                  {isLoading && <LoadingBar />}
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
                        inputView={SearchInputWrapper}
                      />
                    }
                    sideContent={
                      wasSearched && (
                        <div>
                          {getFacetFields().map((field) => (
                            <Facet
                              key={field}
                              field={field}
                              isFilterable={getFacetWithSearch().includes(
                                field
                              )}
                              label={field}
                              view={CustomMultiCheckboxFacet}
                            />
                          ))}
                          <Sorting
                            label="Sort by date"
                            sortOptions={[
                              { name: "-", value: "", direction: "" },
                              {
                                name: "Newest first",
                                value: "created_at",
                                direction: "desc",
                              },
                              {
                                name: "Oldest first",
                                value: "created_at",
                                direction: "asc",
                              },
                            ]}
                          />
                        </div>
                      )
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
                  {wasSearched && !results.length && (
                    <NoResults openForm={openForm} />
                  )}
                  <FormModal formOpen={modalOpen} closeForm={closeForm} />
                </ErrorBoundary>
              </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
    </ChakraProvider>
  );
}
