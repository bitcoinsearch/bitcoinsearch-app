import { useQuery } from "@tanstack/react-query";
import { Document, ViewMode, ViewModeType } from "@/types";

interface DocumentsResponse {
  documents: Document[];
  total: number;
}

const DOCUMENTS_PER_PAGE = 10;

/**
 * Fetches documents based on the current view mode and filters.
 * Handles three different view modes:
 * - Flat: Shows all documents in chronological order
 * - Threaded: Shows documents grouped by discussion threads
 * - Summaries: Shows only combined summary documents
 */
const fetchDocuments = async (
  filterField: string,
  filterValue: string,
  viewType: ViewModeType,
  page: number,
  index: string,
  threadUrls?: string[]
): Promise<DocumentsResponse> => {
  // Base filters that apply to all view modes
  const baseFilters = [
    { field: filterField, value: filterValue },
    {
      field: "type",
      value: "combined-summary",
      // Only include summaries in summary view, exclude them otherwise
      ...(viewType !== ViewMode.SUMMARIES && { operation: "exclude" }),
    },
  ];

  // Construct query parameters based on view mode
  const queryParams = {
    queryString: "",
    filterFields:
      viewType === ViewMode.THREADED && threadUrls
        ? [...baseFilters, { field: "thread_url", value: threadUrls }]
        : baseFilters,
    // In threaded view, we need all documents for the current threads
    size: viewType === ViewMode.THREADED ? 1000 : DOCUMENTS_PER_PAGE,
    page: viewType === ViewMode.THREADED ? 0 : page - 1,
    sortFields: [{ field: "indexed_at", value: "desc" }],
    index,
  };

  const response = await fetch("/api/elasticSearchProxy/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(queryParams),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  const data = await response.json();
  const hits = data.data.result.hits;

  return {
    documents: hits.hits.map((hit) => hit._source),
    // In threaded view, total is the number of threads
    // Otherwise, it's the total number of matching documents
    total:
      viewType === ViewMode.THREADED
        ? threadUrls?.length || 0
        : hits.total.value,
  };
};

/**
 * Hook that provides document data for the current view.
 * Handles different view modes and pagination.
 */
export const useExploreDocuments = (
  filterField: string,
  filterValue: string,
  viewType: ViewModeType,
  page: number,
  index: string,
  threadUrls?: string[]
) => {
  return useQuery<DocumentsResponse, Error>({
    queryKey: [
      "exploreDocuments",
      filterField,
      filterValue,
      viewType,
      page,
      index,
      threadUrls,
    ],
    queryFn: () =>
      fetchDocuments(
        filterField,
        filterValue,
        viewType,
        page,
        index,
        threadUrls
      ),
    // Only fetch if we're not in threaded view, or if we have thread URLs in threaded view
    enabled: viewType === ViewMode.THREADED ? !!threadUrls?.length : true,
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
