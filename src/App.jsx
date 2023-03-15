import * as React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  SearchProvider,
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
} from "./config/config-helper";

// COMPONENTS //
import { useCallback, useState } from "react";
import CustomResults from "./components/customResults/CustomResults";
import { useSearchFocusHotkey } from "./hooks/useGlobalHotkey";
import NoResults from "./components/noResultsCard/NoResults";
import FormModal from "./components/formModal/FormModal";
import { useEffect } from "react";
import { useRef } from "react";
import LoadingBar from "./components/loadingBar/LoadingBar";
import Header from "./layout/Header";
import SideBar from "./layout/SideBar";
import CustomPagingInfo from "./components/customPagingInfo/CustomPagingInfo";
import Footer from "./components/footer/Footer";
import theme from "./chakra/chakra-theme";

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
                    <img src={logo} className="logo" alt="bitcoin logo" />
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
                  <div className="footer">
                    <a
                      href="https://chaincode.com"
                      target="_blank"
                      rel="noreferrer"
                      className="chaincode-link"
                    >
                      ❤️ Chaincode
                    </a>
                  </div>
                </ErrorBoundary>
              </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
    </ChakraProvider>
  );
}
