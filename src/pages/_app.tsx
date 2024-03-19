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
import Script from 'next/script';
import { AddSourceProvider } from "@/context/AddSourceContext";

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
            <AddSourceProvider>
              <Head>
                <meta charSet="utf-8" />
                <link rel="shortcut icon" href="./favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Bitcoin Search</title>
                <link rel="manifest" href="./manifest.json" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://bitcoinsearch.xyz/btc_book_2_1.jpg?v1"/>
                <meta name="twitter:title" content="Technical ₿itcoin Search"/>
                <meta name="twitter:description" content="The bitcoin technical search we deserve"/>
              </Head>
              <Script async src="https://visits.bitcoindevs.xyz/script.js" data-website-id="84277a9b-dc29-4401-a83e-15683c9d5c53" />
              <Component {...pageProps} />
            </AddSourceProvider>
          </SearchProvider>
        </SearchQueryProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
