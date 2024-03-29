import { SearchQuery } from "@/types";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { useQuery } from "@tanstack/react-query";

type BuildQuery = ({queryString, size, page, filterFields, sortFields}: SearchQuery) => Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>

const buildQueryCall: BuildQuery = async ({queryString, size, page, filterFields, sortFields}) => {
  const body = {
    queryString,
    size,
    page,
    filterFields,
    sortFields,
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

export const useSearch = ({
  queryString, size, page, filterFields, sortFields
}: SearchQuery) => {
  const hasFilters = Boolean(filterFields.length)
  const queryResult = useQuery({
    queryKey: ["query", queryString, filterFields, page, sortFields],
    queryFn: () => buildQueryCall({queryString, size, page, filterFields, sortFields}),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: true,
    // enabled: !!queryString?.trim() || hasFilters,
  });

  return queryResult
}

