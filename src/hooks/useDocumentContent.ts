import { useQuery } from "@tanstack/react-query";

interface DocumentContent {
  title: string;
  url: string;
  content: string;
  indexed_at: string;
}

const fetchDocumentContent = async (url: string): Promise<DocumentContent> => {
  const response = await fetch("/api/elasticSearchProxy/getDocumentContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const useDocumentContent = (url: string) => {
  const { data, isLoading, isError, error } = useQuery<DocumentContent, Error>({
    queryKey: ["documentContent", url],
    queryFn: () => fetchDocumentContent(url),
    enabled: !!url,
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    documentContent: data,
    isLoading,
    isError,
    error,
  };
};
