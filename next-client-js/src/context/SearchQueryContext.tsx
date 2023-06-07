import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type QueryObject = Record<string, string>

export type SearchQueryContextType = {
  queryResult: UseQueryResult<any, unknown>,
  makeQuery: (queryString: any) => void,
}

export const SearchQueryContext = createContext<SearchQueryContextType | null>(null);

export const SearchQueryProvider = ({ children }: { children: React.ReactNode}) => {
  // URL
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(0);

  const test: QueryObject = {
    "hds": "sdkj",
    "dsd": "dss"
  }

  const setSearchParams = useCallback((queryObject: QueryObject) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(queryObject).map(objectKey => {
      params.set(objectKey, queryObject[objectKey])
    })
    const paramsString = params.toString()
  }, [searchParams, pathName])

  const buildQueryCall = async (searchQuery, filter, page) => {
    const body = {
      searchString: searchQuery,
      // "facets": [
      //     // {"field": "tags", "value": "segwit"}
      //     {"field": "authors", "value": "pieter"}
      // ]
    };

    const jsonBody = JSON.stringify(body);

    return fetch("http://localhost:3000/api/v1/search", {
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
    enabled: !!searchQuery?.trim(),
  });

  const makeQuery = (queryString) => {
    setSearchParams({ search: queryString });
  };

  // const addFilter = () => {

  // };

  return (
    <SearchQueryContext.Provider value={{ queryResult, makeQuery }} >
      {children}
    </SearchQueryContext.Provider>
  );
};

export default SearchQueryContext;
