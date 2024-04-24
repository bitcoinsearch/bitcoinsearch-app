import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-sans/800.css";

import "../styles/globals.css";
import "../styles/custom.scss";
import "../components/customResults/styles.results.scss";
import "../components/filterTag/filterTags.scss";
import "../components/footer/footer.scss";
import "../components/loadingBar/loadingBar.scss";
import "../components/noResultsCard/noResults.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchQueryProvider } from "@/context/SearchQueryContext";
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from "@/config/config-helper";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider } from "@elastic/react-search-ui";
import theme from "@/chakra/chakra-theme";
import { SearchDriverOptions } from "@elastic/search-ui";
import Head from "next/head";
import Script from "next/script";
import { UIContextProvider } from "@/context/UIContext";
import { ThemeProvider } from "@/context/Theme";
import Metadata from "@/layout/Metadata";

const queryClient = new QueryClient();

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
// const connector = new CustomConnector();
const config: SearchDriverOptions = {
  // searchQuery: {
  //   facets: buildFacetConfigFromConfig(),
  //   ...buildSearchOptionsFromConfig(),
  // },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: false,
  initialState: { resultsPerPage: 50 },
};

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SearchQueryProvider>
          <SearchProvider config={config}>
            <UIContextProvider>
              <ThemeProvider>
                <Metadata>
                  <Component {...pageProps} />
                </Metadata>
              </ThemeProvider>
            </UIContextProvider>
          </SearchProvider>
        </SearchQueryProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
