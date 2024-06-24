import { SearchQuery } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { buildQueryCall } from "./searchCall";

/**
 * Custom React hook for performing search queries against an Elasticsearch backend via a proxy endpoint.
 * Utilizes React Query's `useQuery` to manage fetching, caching, and updating of search results.
 */
export const useSearch = ({
  queryString,
  size,
  page,
  filterFields,
  sortFields,
}: SearchQuery) => {
  const hasFilters = Boolean(filterFields.length);
  const queryResult = useQuery({
    queryKey: ["query", queryString, size, filterFields, page, sortFields],
    queryFn: () =>
      buildQueryCall({ queryString, size, page, filterFields, sortFields }),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: true,
    // enabled: !!queryString?.trim() || hasFilters,
  });

  return queryResult;
};
