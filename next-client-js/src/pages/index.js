import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// CSS/ASSETS //
import { ChakraProvider } from "@chakra-ui/react";

// CONFIG //
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from "@/config/config-helper";

// COMPONENTS //
import { useCallback, useState } from "react";
import CustomResults from "@/components/customResults/CustomResults";
import { useSearchFocusHotkey } from "@/hooks/useGlobalHotkey";
import NoResults from "@/components/noResultsCard/NoResults";
import FormModal from "@/components/formModal/FormModal";
import { useEffect } from "react";
import { useRef } from "react";
import LoadingBar from "@/components/loadingBar/LoadingBar";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import Footer from "@/components/footer/Footer";
import HomeFooter from "@/components/footer/HomeFooter";
import theme from "@/chakra/chakra-theme";
import {
  createCustomConnector,
  CustomConnector,
} from "./api/elasticSearchProxy/connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSearchQuery from "@/hooks/useSearchQuery";
import { SearchQueryProvider } from "@/context/SearchQueryContext";

const queryClient = new QueryClient();

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
// const connector = new CustomConnector();
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

  const openForm = useCallback(() => {
    setModalOpen(true);
  }, []);
  const closeForm = () => {
    setModalOpen(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SearchQueryProvider>
          <SearchProvider config={config}>
            <WithSearch
              mapContextToProps={({
                wasSearched,
                results,
                current,
                isLoading,
                filters,
              }) => ({
                wasSearched,
                results,
                current,
                isLoading,
                filters,
              })}
            >
              {({ wasSearched, results, current, isLoading }) => {
                return (
                  <div className="App btc-search">
                    <ErrorBoundary>
                      <ScrollTop current={current} />
                      {isLoading && <LoadingBar />}
                      <div className="header">
                        <img
                          src="/btc.png"
                          className="logo"
                          alt="bitcoin logo"
                        />
                        <p className="description">Technical Bitcoin Search</p>
                      </div>
                      <Layout
                        header={<Header key={results} openForm={openForm} />}
                        sideContent={<SideBar />}
                        bodyContent={
                          <CustomResults shouldTrackClickThrough={true} />
                        }
                        bodyHeader={<CustomPagingInfo />}
                        bodyFooter={<Footer />}
                      />
                      {wasSearched && !results.length && (
                        <NoResults openForm={openForm} />
                      )}
                      <FormModal formOpen={modalOpen} closeForm={closeForm} />
                      <TestNewApi />
                    </ErrorBoundary>
                  </div>
                );
              }}
            </WithSearch>
          </SearchProvider>
        </SearchQueryProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export const TestNewApi = () => {
  const { queryResult, makeQuery } = useSearchQuery();
  // console.log(queryResult);

  // const testFetch = async () => {
  //   const res = await fetch("http://localhost:3000/api/v1/search", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       searchString: "bip",
  //     }),
  //   });
  //   const ss = await res.json();
  //   console.log("fin", ss);
  // };

  return (
    // <button onClick={testFetch}>
    <button onClick={() => makeQuery("bip")}>Test me!</button>
  );
};
