import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router"
import { URLSearchParamsKeyword, defaultParam } from "@/config/config";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { useSearch } from "@/service/api/search/useSearch";

export type QueryObject = Record<string, string>

export type PagingInfoType = {
  resultsPerPage: number,
  current: number,
  totalResults: number | null
}

export type SearchQueryContextType = {
  searchQuery: string,
  queryResult: UseQueryResult<any, unknown>,
  makeQuery: (queryString: any) => void,
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

  const [filter, setFilter] = useState([]);

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
    console.log(router.query)
    router.push(router, undefined, { shallow: true })
  }, [searchParams])

  const queryResult = useSearch({
    searchQuery,
    size: resultsPerPage,
    page,
    facet: filter
  })
  
  const makeQuery = (queryString: string) => {
    console.log({queryString})
    setSearchParams({ search: queryString, page: "1" });
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
