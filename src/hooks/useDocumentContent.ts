import { useQuery } from "@tanstack/react-query";

interface DocumentContent {
  title: string;
  url: string;
  content: string;
  indexed_at: string;
}

const fetchDocumentContent = async (
  id: string,
  index: string
): Promise<DocumentContent> => {
  const response = await fetch("/api/elasticSearchProxy/getDocumentContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, index }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const useDocumentContent = (id: string, index: string) => {
  const { data, isLoading, isError, error } = useQuery<DocumentContent, Error>({
    queryKey: ["documentContent", id, index],
    queryFn: () => fetchDocumentContent(id, index),
    enabled: !!id,
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
