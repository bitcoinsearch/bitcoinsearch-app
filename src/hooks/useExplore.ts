import { useQuery } from "@tanstack/react-query";

/**
 * Features available for each explorer item (e.g., domain, author, tag)
 * These determine what view modes are available in the UI
 */
interface ExplorerFeatures {
  hasSummaries: boolean; // Whether combined summaries exist for this item
  hasThreads: boolean; // Whether threaded discussions exist for this item
}

interface ExplorerItem {
  value: string; // The unique identifier (e.g., domain name, author name)
  documentCount: number; // Total number of documents for this item
  lastScraped: number; // Timestamp of the most recent document
  features: ExplorerFeatures;
}

interface ExplorerResponse {
  items: ExplorerItem[];
  total: number;
}

/**
 * Fetches aggregated data for the explorer view. This function retrieves high-level statistics
 * and available features for each unique value of the specified field (e.g., all domains and their document counts).
 *
 * The exploreType parameter determines what we're exploring:
 * - "domain" for exploring different sources
 * - "authors" for exploring different authors
 * - "tags" for exploring different topics
 */
const fetchExploreData = async (
  exploreType: string,
  index: string
): Promise<ExplorerResponse> => {
  // We use Elasticsearch aggregations to efficiently compute statistics
  // without retrieving individual documents
  const response = await fetch("/api/elasticSearchProxy/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      queryString: "",
      size: 0, // We don't need individual documents, only aggregations
      page: 0,
      index,
      aggregationFields: [
        {
          field: exploreType,
          size: 1000, // Maximum number of unique values to retrieve
          subAggregations: {
            // Get the most recent document timestamp
            last_indexed: { max: { field: "indexed_at" } },
            // Check if any documents are summaries
            has_summaries: {
              filter: { term: { "type.keyword": "combined-summary" } },
            },
            // Check if any documents are part of threaded discussions
            has_threads: {
              filter: { exists: { field: "thread_url" } },
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch explorer data: ${response.statusText}`);
  }

  const data = await response.json();
  const buckets = data.data.result.aggregations[exploreType].buckets;

  return {
    items: buckets.map((bucket) => ({
      value: bucket.key,
      documentCount: bucket.doc_count,
      lastScraped: bucket.last_indexed.value,
      features: {
        hasSummaries: bucket.has_summaries.doc_count > 0,
        hasThreads: bucket.has_threads.doc_count > 0,
      },
    })),
    total: buckets.length,
  };
};

/**
 * Hook that provides data for the explorer view's main listing.
 * Used to populate the main table showing available sources, authors, or tags.
 */
export const useExplore = (exploreType: string, index: string) => {
  return useQuery<ExplorerResponse, Error>({
    queryKey: ["explore", exploreType, index],
    queryFn: () => fetchExploreData(exploreType, index),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
