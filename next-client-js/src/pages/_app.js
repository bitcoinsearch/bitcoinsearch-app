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
import {CustomConnector} from "./api/elasticSearchProxy/connector";
import theme from "@/chakra/chakra-theme";

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

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SearchQueryProvider>
          <SearchProvider config={config}>
            <Component {...pageProps} />
          </SearchProvider>
        </SearchQueryProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
