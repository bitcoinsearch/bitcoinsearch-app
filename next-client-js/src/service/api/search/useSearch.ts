import { Facet } from "@/types";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { useQuery } from "@tanstack/react-query";

type BuildQuery = (searchQuery: string, size: number, page: number, facet: Facet[]) => Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>

const buildQueryCall: BuildQuery = async (searchQuery, size, page, facet) => {
  const body = {
    searchString: searchQuery,
    size,
    from: page,
    facet
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

type FilterOption = {
  type: string;
  value: string;
}

type SearchQuery = {
  searchQuery: string;
  size: number;
  page: number;
  facet: Facet[];
}

export const useSearch = ({
  searchQuery, size, page, facet
}: SearchQuery) => {
  const queryResult = useQuery({
    queryKey: ["query", searchQuery, facet, page],
    queryFn: () => buildQueryCall(searchQuery, size, page, facet),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!searchQuery?.trim(),
  });

  return queryResult
}

