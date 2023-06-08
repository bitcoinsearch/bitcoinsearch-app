import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { URLSearchParamsKeyword, defaultParam } from "@/config/config";

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
  // const pathName = usePathname();
  // const searchParams = useSearchParams();
  const searchParams = router.query;
  const rawSearchQuery = searchParams[URLSearchParamsKeyword.SEARCH] as string;
  const pageQuery = searchParams[URLSearchParamsKeyword.PAGE] as string;
  const sizeQuery = searchParams[URLSearchParamsKeyword.SIZE] as string;

  const [filter, setFilter] = useState([]);
  // const [page, setPage] = useState(0);

  const searchQuery = useMemo(() => 
    rawSearchQuery
  , [rawSearchQuery])

  const page = useMemo(() => {
    
    return pageQuery ? parseInt(pageQuery) - 1 ?? 0 : 0

  }
  , [pageQuery])

  const resultsPerPage = sizeQuery ?? defaultParam[URLSearchParamsKeyword.SIZE]

  const setSearchParams = useCallback((queryObject: QueryObject) => {
    Object.keys(queryObject).map(objectKey => {
      router.query[objectKey] = queryObject[objectKey]
    })
    console.log(router.query)
    router.push(router, undefined, { shallow: true })
    // const params = new URLSearchParams(searchParams.toString());
    // Object.keys(queryObject).map(objectKey => {
    //   params.set(objectKey, queryObject[objectKey])
    // })
    // const paramsString = params.toString()
  }, [searchParams])

  const buildQueryCall = async (searchQuery, filter, page) => {
    const body = {
      searchString: searchQuery,
      size: 2,
      from: page
      // "facets": [
      //     // {"field": "tags", "value": "segwit"}
      //     {"field": "authors", "value": "pieter"}
      // ]
    };

    const jsonBody = JSON.stringify(body);

    return fetch("/api/elasticSearchProxy/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    })
      .then(async (res) => {
        // let jsonData = await res.json()
        const data = await res.json();
        if (!data.success) {
          const errMessage = data.message || "Error while fetching";
          throw new Error(errMessage);
        }
        return data.data?.result;
      })
      .catch((err) => {
        throw new Error(err.message ?? "Error fetching results");
      });
  };

  const queryResult = useQuery({
    queryKey: ["query", searchQuery, filter, page],
    queryFn: () => buildQueryCall(searchQuery, filter, page),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!searchQuery?.trim(),
  });

  const makeQuery = (queryString: string) => {
    console.log({queryString})
    setSearchParams({ search: queryString });
  };

  // const addFilter = () => {

  // };

  const handlePageChange = (page: number) => {
    setSearchParams({page: JSON.stringify(page)})
  }

  const pagingInfo = {
    resultsPerPage,
    current: page + 1,
    totalResults: queryResult.data?.hits?.total?.value ?? null
  }

  return (
    <SearchQueryContext.Provider value={{ searchQuery, queryResult, makeQuery, handlePageChange, pagingInfo }} >
      {children}
    </SearchQueryContext.Provider>
  );
};
