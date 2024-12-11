import React, { useState } from "react";
import { useSourceDocuments } from "@/hooks/useSourceDocuments";
import { useDocumentContent } from "@/hooks/useDocumentContent";
import DocumentModal from "./DocumentModal";
import ViewModeSelector from "./ViewModeSelector";
import PaginationControls from "./PaginationControls";
import DocumentTable from "./DocumentTable";
import ThreadedDocumentTable from "./ThreadedDocumentTable";
import { ViewMode, ViewModeType } from "@/types";

interface SourceDocumentsProps {
  domain: string;
  hasSummaries: boolean;
  hasThreads: boolean;
}

const Documents: React.FC<SourceDocumentsProps> = ({
  domain,
  hasSummaries,
  hasThreads,
}) => {
  const [page, setPage] = useState(1);
  const [threadsPage, setThreadsPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewModeType>(ViewMode.FLAT);
  const [expandedThreads, setExpandedThreads] = useState(new Set<string>());

  const { sourceDocuments, total, isLoading, isError, error } =
    useSourceDocuments(domain, page, viewMode, threadsPage);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const {
    documentContent,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useDocumentContent(selectedDocumentId);

  if (isLoading) return <div>Loading source documents...</div>;
  if (isError)
    return <div>Error loading source documents: {error.message}</div>;

  const totalPages = Math.ceil(total / 10);

  const handleViewModeChange = (newMode: ViewModeType) => {
    // Reset to flat view if trying to switch to an unavailable mode
    if (
      (newMode === ViewMode.THREADED && !hasThreads) ||
      (newMode === ViewMode.SUMMARIES && !hasSummaries)
    ) {
      newMode = ViewMode.FLAT;
    }
    setViewMode(newMode);
    setPage(1);
    setThreadsPage(1);
    setExpandedThreads(new Set());
  };

  const toggleThread = (threadUrl: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadUrl)) {
      newExpanded.delete(threadUrl);
    } else {
      newExpanded.add(threadUrl);
    }
    setExpandedThreads(newExpanded);
  };

  const handleViewDocument = (id: string) => {
    setSelectedDocumentId(id);
  };

  // Group documents by thread_url for threaded view
  const threadGroups =
    viewMode === ViewMode.THREADED
      ? sourceDocuments?.reduce((acc, doc) => {
          const threadUrl = doc.thread_url || "ungrouped";
          if (!acc[threadUrl]) {
            acc[threadUrl] = [];
          }
          acc[threadUrl].push(doc);
          return acc;
        }, {} as Record<string, typeof sourceDocuments>)
      : {};

  const handlePageChange = (newPage: number) => {
    if (viewMode === ViewMode.THREADED) {
      setThreadsPage(newPage);
    } else {
      setPage(newPage);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Documents for {domain}</h3>
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          hasThreads={hasThreads}
          hasSummaries={hasSummaries}
        />
      </div>

      <div className="overflow-x-auto">
        {viewMode === ViewMode.THREADED ? (
          <ThreadedDocumentTable
            threadGroups={threadGroups}
            expandedThreads={expandedThreads}
            onToggleThread={toggleThread}
            onViewDocument={handleViewDocument}
          />
        ) : (
          <DocumentTable
            documents={sourceDocuments}
            domain={domain}
            onViewDocument={handleViewDocument}
          />
        )}
      </div>

      <PaginationControls
        currentPage={viewMode === ViewMode.THREADED ? threadsPage : page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <DocumentModal
        isOpen={!!selectedDocumentId}
        onClose={() => setSelectedDocumentId(null)}
        document={documentContent}
        isLoading={isContentLoading}
        isError={isContentError}
        error={contentError?.message}
      />
    </div>
  );
};

export default Documents;
