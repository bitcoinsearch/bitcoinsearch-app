import { useQuery } from "@tanstack/react-query";

interface ThreadBucket {
  key: string; // The thread URL
  doc_count: number; // Number of documents in the thread
  latest_doc: { value: number }; // Timestamp of the most recent document
}

interface ThreadsData {
  threads: ThreadBucket[];
  paginatedThreads: ThreadBucket[]; // Subset of threads for current page
  total: number;
}

const THREADS_PER_PAGE = 10;

/**
 * Fetches thread data for a specific filter (e.g., all threads from a specific domain).
 * Uses Elasticsearch aggregations to group documents by their thread_url and
 * compute statistics for each thread.
 */
const fetchThreadsData = async (
  filterField: string,
  filterValue: string,
  page: number,
  index: string
): Promise<ThreadsData> => {
  const response = await fetch("/api/elasticSearchProxy/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      queryString: "",
      size: 0,
      page: 0,
      index,
      filterFields: [
        { field: filterField, value: filterValue },
        // Exclude summary documents from thread view
        { field: "type", value: "combined-summary", operation: "exclude" },
      ],
      aggregationFields: [
        {
          field: "thread_url",
          size: 1000,
          subAggregations: {
            latest_doc: { max: { field: "indexed_at" } },
            doc_count: { value_count: { field: "thread_url.keyword" } },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.statusText}`);
  }

  const data = await response.json();
  const allThreads = data.data.result.aggregations["thread_url"].buckets;

  // Handle client-side pagination of threads
  const start = (page - 1) * THREADS_PER_PAGE;
  const paginatedThreads = allThreads.slice(start, start + THREADS_PER_PAGE);

  return {
    threads: allThreads,
    paginatedThreads,
    total: allThreads.length,
  };
};

/**
 * Hook that provides thread data when viewing content in threaded mode.
 * Used to show grouped discussions and their statistics.
 */
export const useExploreThreads = (
  filterField: string,
  filterValue: string,
  page: number,
  enabled: boolean = true,
  index: string
) => {
  const query = useQuery<ThreadsData, Error>({
    queryKey: ["exploreThreads", filterField, filterValue, page, index],
    queryFn: () => fetchThreadsData(filterField, filterValue, page, index),
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    paginatedThreads: query.data?.paginatedThreads || [],
    totalThreads: query.data?.total || 0,
  };
};
