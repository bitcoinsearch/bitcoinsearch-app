import React, { useState } from "react";
import DocumentModal from "./DocumentModal";
import PaginationControls from "./PaginationControls";
import DocumentTable from "./DocumentTable";
import ViewModeSelector from "./ViewModeSelector";
import { useExploreThreads } from "@/hooks/useExploreThreads";
import { useExploreDocuments } from "@/hooks/useExploreDocuments";
import { ViewMode, ViewModeType } from "@/types";

interface DocumentsProps {
  filterField: string;
  filterValue: string;
  features: {
    hasSummaries: boolean;
    hasThreads: boolean;
  };
  selectedIndex: string;
}

const Documents: React.FC<DocumentsProps> = ({
  filterField,
  filterValue,
  features,
  selectedIndex,
}) => {
  const [viewType, setViewType] = useState<ViewModeType>(ViewMode.FLAT);
  const [page, setPage] = useState(1);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set()
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  // Get threads data if in threaded view
  const {
    paginatedThreads,
    totalThreads,
    isLoading: isLoadingThreads,
  } = useExploreThreads(
    filterField,
    filterValue,
    page,
    viewType === ViewMode.THREADED,
    selectedIndex
  );

  // Get documents data
  const {
    data: documentsData,
    isLoading: isLoadingDocs,
    isError,
    error,
  } = useExploreDocuments(
    filterField,
    filterValue,
    viewType,
    page,
    selectedIndex,
    viewType === ViewMode.THREADED
      ? paginatedThreads.map((t) => t.key)
      : undefined
  );

  // Loading and error states
  const isLoading =
    viewType === ViewMode.THREADED
      ? isLoadingThreads || isLoadingDocs
      : isLoadingDocs;

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error loading documents: {error.message}</div>;

  const documents = documentsData?.documents || [];
  const totalPages = Math.ceil(
    (viewType === ViewMode.THREADED
      ? totalThreads
      : documentsData?.total || 0) / 10
  );

  // Event handlers
  const handleViewModeChange = (newMode: ViewModeType) => {
    setViewType(newMode);
    setPage(1);
    setExpandedThreads(new Set());
  };

  const handleToggleThread = (threadUrl: string) => {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(threadUrl)) {
        next.delete(threadUrl);
      } else {
        next.add(threadUrl);
      }
      return next;
    });
  };

  return (
    <div className="mt-4 px-4">
      <ViewModeSelector
        viewMode={viewType}
        onViewModeChange={handleViewModeChange}
        hasThreads={features.hasThreads}
        hasSummaries={features.hasSummaries}
      />

      <div className="overflow-x-auto mt-4">
        <DocumentTable
          documents={documents}
          onViewDocument={setSelectedDocumentId}
          viewType={viewType}
          expandedThreads={expandedThreads}
          onToggleThread={handleToggleThread}
        />
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DocumentModal
        isOpen={!!selectedDocumentId}
        onClose={() => setSelectedDocumentId(null)}
        id={selectedDocumentId}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default Documents;
