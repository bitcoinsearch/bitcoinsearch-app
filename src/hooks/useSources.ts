import { useQuery } from "@tanstack/react-query";
import { EsSourcesResponse } from "@/types";

type FetchSources = (url?: string) => Promise<EsSourcesResponse>;

const fetchSources: FetchSources = async (url) => {
  return fetch(url ?? "/api/elasticSearchProxy/sources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        const errMessage = data.message || "Error while fetching sources";
        throw new Error(errMessage);
      }
      return data.data?.result;
    })
    .catch((err) => {
      throw new Error(err.message ?? "Error fetching sources");
    });
};

export const useSources = () => {
  const { data, isLoading, isError, error } = useQuery<
    EsSourcesResponse,
    Error
  >({
    queryKey: ["sources"],
    queryFn: () => fetchSources(),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    sources: data,
    isLoading,
    isError,
    error,
  };
};
