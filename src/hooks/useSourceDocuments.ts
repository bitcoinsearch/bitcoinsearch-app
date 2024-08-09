import { useQuery } from "@tanstack/react-query";

interface Document {
  title: string;
  url: string;
  indexed_at: string;
}

interface SourceDocumentsResponse {
  documents: Document[];
  total: number;
}

const fetchSourceDocuments = async (
  domain: string,
  page: number
): Promise<SourceDocumentsResponse> => {
  const response = await fetch("/api/elasticSearchProxy/sourceDocuments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, page }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const useSourceDocuments = (domain: string, page: number) => {
  const { data, isLoading, isError, error } = useQuery<
    SourceDocumentsResponse,
    Error
  >({
    queryKey: ["sourceDocuments", domain, page],
    queryFn: () => fetchSourceDocuments(domain, page),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    sourceDocuments: data?.documents,
    total: data?.total,
    isLoading,
    isError,
    error,
  };
};
