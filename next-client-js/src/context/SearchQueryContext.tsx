import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router"
import { URLSearchParamsKeyword, defaultParam } from "@/config/config";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { useSearch } from "@/service/api/search/useSearch";
import { getFacetFields, getSortFields } from "@/config/config-helper";
import { appendFilterName, generateFilterQuery, generateSortFields } from "@/service/URLManager/helper";
import { Facet } from "@/types";

export type QueryObject = Record<string, string>

export type PagingInfoType = {
  resultsPerPage: number,
  current: number,
  totalResults: number | null
}

export type SearchQueryContextType = {
  searchQuery: string,
  queryResult: UseQueryResult<SearchResponse<unknown, Record<string, AggregationsAggregate>>, unknown>,
  makeQuery: (queryString: string) => void,
  handlePageChange: (page: number) => void,
  pagingInfo: PagingInfoType,
}

export const SearchQueryContext = createContext<SearchQueryContextType | null>(null);

export const SearchQueryProvider = ({ children }: { children: React.ReactNode}) => {
  // URL
  const router = useRouter();
  const searchParams = router.query;
  const rawSearchQuery = searchParams[URLSearchParamsKeyword.SEARCH] as string;
  const pageQuery = searchParams[URLSearchParamsKeyword.PAGE] as string;
  const sizeQuery = searchParams[URLSearchParamsKeyword.SIZE] as string;

  const filterFields = generateFilterQuery(router.asPath.slice(1))
  const sortFields = generateSortFields(router.asPath.slice(1))

  const searchQuery = useMemo(() => {
    return rawSearchQuery ?? ""
  }, [rawSearchQuery])

  const page = useMemo(() => {
    return pageQuery ? parseInt(pageQuery) - 1 ?? 0 : 0
  }, [pageQuery])

  const resultsPerPage = sizeQuery ? (parseInt(sizeQuery) ?? defaultParam[URLSearchParamsKeyword.SIZE]) : defaultParam[URLSearchParamsKeyword.SIZE]
  const setSearchParams = useCallback((queryObject: QueryObject) => {
    Object.keys(queryObject).map(objectKey => {
      router.query[objectKey] = queryObject[objectKey]
    })
    router.push(router, undefined, { shallow: true })
  }, [searchParams])

  const queryResult = useSearch({
    queryString: searchQuery,
    size: resultsPerPage,
    page,
    filterFields,
    sortFields,
  })
  
  const makeQuery = (queryString: string) => {
    setSearchParams({ search: queryString });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({page: JSON.stringify(page)})
  }

  const pagingInfo = {
    resultsPerPage,
    current: page + 1,
    totalResults: queryResult.data?.hits?.total["value"] as unknown as number ?? null
  }

  return (
    <SearchQueryContext.Provider value={{ searchQuery, queryResult, makeQuery, handlePageChange, pagingInfo }} >
      {children}
    </SearchQueryContext.Provider>
  );
};
