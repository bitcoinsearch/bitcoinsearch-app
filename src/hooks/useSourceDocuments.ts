import { useQuery } from "@tanstack/react-query";
import { ViewModeType, Document } from "@/types";

interface SourceDocumentsResponse {
  documents: Document[];
  total: number;
  viewMode: ViewModeType;
}

const fetchSourceDocuments = async (
  domain: string,
  page: number,
  viewMode: ViewModeType,
  threadsPage: number
): Promise<SourceDocumentsResponse> => {
  const response = await fetch("/api/elasticSearchProxy/sourceDocuments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, page, viewMode, threadsPage }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const useSourceDocuments = (
  domain: string,
  page: number,
  viewMode: ViewModeType,
  threadsPage: number
) => {
  const { data, isLoading, isError, error } = useQuery<
    SourceDocumentsResponse,
    Error
  >({
    queryKey: ["sourceDocuments", domain, page, viewMode, threadsPage],
    queryFn: () => fetchSourceDocuments(domain, page, viewMode, threadsPage),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    sourceDocuments: data?.documents,
    total: data?.total,
    viewMode: data?.viewMode,
    isLoading,
    isError,
    error,
  };
};
