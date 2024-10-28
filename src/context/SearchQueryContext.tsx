import { UseQueryResult } from "@tanstack/react-query";
import React, { createContext, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { URLSearchParamsKeyword, defaultParam } from "@/config/config";
import { useSearch } from "@/service/api/search/useSearch";
import {
  generateFilterQuery,
  generateSortFields,
} from "@/service/URLManager/helper";
import { EsSearchResponse, Facet } from "@/types";

export type QueryObject = Record<string, string>;

export type PagingInfoType = {
  resultsPerPage: number;
  current: number;
  totalResults: number | null;
};

export type SearchQueryContextType = {
  searchQuery: string;
  queryResult: UseQueryResult<EsSearchResponse>;
  makeQuery: (queryString: string) => void;
  handlePageChange: (page: number) => void;
  pagingInfo: PagingInfoType;
  filterFields: Facet[];
};

// Create a context for sharing search-related data and methods across components
export const SearchQueryContext = createContext<SearchQueryContextType | null>(
  null
);

/**
 * React context provider designed to encapsulate and manage the state and logic associated with search functionality.
 * It leverages the NextJS router to read and update the URL's query parameters for search queries
 * and pagination, and uses React Query for fetching search results from an Elasticsearch backend.
 *
 * Flow:
 * 1. Extracts search parameters (search query, filters, sorting, page, and results per page) from the URL's query parameters.
 * 2. Utilizes useMemo to memoize calculations for search parameters and URLSearchParams for efficient query manipulation.
 * 3. The `useSearch` hook fetches search results based on the current search parameters.
 * 4. Provides two main functions, `makeQuery` and `handlePageChange`, to update the URL's query parameters
 *    and thereby trigger new searches or page changes. These updates are performed through the NextJS router,
 *    allowing for client-side navigation without full page reloads.
 * 5. Any change to the URL's query parameters triggers a re-fetch of search results via `useSearch`,
 *    updating the `queryResult` state with the new results.
 * 6. The updated search state (current search query, search results, pagination information) is made available
 *    to child components through the `SearchQueryContext`, enabling a reactive search UI that updates in response
 *    to user actions and URL changes.
 *
 * This provider enhances the search experience by enabling URL-driven search state, client-side navigation,
 * and seamless integration with React Query for data fetching, making it a central piece of the application's search functionality.
 */

export const SearchQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Extract search parameters from the URL
  const router = useRouter();
  const searchParams = router.query;
  const rawSearchQuery = searchParams[URLSearchParamsKeyword.SEARCH] as string;
  const pageQuery = searchParams[URLSearchParamsKeyword.PAGE] as string;
  const sizeQuery = searchParams[URLSearchParamsKeyword.SIZE] as string;

  // Generate filter and sort criteria from the URL path
  const filterFields = generateFilterQuery(router.asPath.slice(1));
  const sortFields = generateSortFields(router.asPath.slice(1));

  // dynamic representation of the query parameters present in the current URL
  const urlParams = useMemo(() => {
    return new URLSearchParams(router.asPath.slice(1));
  }, [router]);

  // Memoize derived state from URL search parameters
  const searchQuery = useMemo(() => {
    return rawSearchQuery ?? "";
  }, [rawSearchQuery]);
  const page = useMemo(() => {
    return pageQuery ? parseInt(pageQuery) - 1 : 0;
  }, [pageQuery]);

  const resultsPerPage = sizeQuery
    ? parseInt(sizeQuery) || defaultParam[URLSearchParamsKeyword.SIZE]
    : defaultParam[URLSearchParamsKeyword.SIZE];

  const setSearchParams = useCallback(
    (queryObject: QueryObject) => {
      Object.keys(queryObject).map((objectKey) => {
        urlParams.set(objectKey, queryObject[objectKey]);
      });
      router.push(router.pathname + "?" + urlParams.toString(), undefined, {
        shallow: true,
      });
    },
    [router, urlParams]
  );

  // Use custom search hook with current search criteria
  const queryResult = useSearch({
    queryString: searchQuery,
    size: resultsPerPage,
    page,
    filterFields,
    sortFields,
  });

  // Function to initiate a new search with the given queryString
  const makeQuery = (queryString: string) => {
    router.query = {};
    urlParams.delete(URLSearchParamsKeyword.PAGE); // new search query resets the user back to the first page of results
    urlParams.set(URLSearchParamsKeyword.SEARCH, queryString.trim()); // new search query
    router.push(`${router.pathname}?${urlParams.toString()}`, undefined, {
      shallow: true,
    });
  };

  // Function to handle page changes in pagination
  const handlePageChange = (page: number) => {
    setSearchParams({ page: JSON.stringify(page) });
  };

  // Compile paging information from search results and current state
  const pagingInfo = {
    resultsPerPage,
    current: page + 1, // Adjust for zero-based index
    totalResults:
      (queryResult.data?.hits?.total["value"] as unknown as number) ?? null,
  };

  return (
    <SearchQueryContext.Provider
      value={{
        searchQuery,
        queryResult,
        makeQuery,
        handlePageChange,
        pagingInfo,
        filterFields,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
};
