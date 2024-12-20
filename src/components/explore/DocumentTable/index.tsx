import React, { useMemo } from "react";
import { Document, ViewMode, ViewModeType } from "@/types";
import { FlatTable } from "./FlatTable";
import { ThreadedTable } from "./ThreadedTable";

interface DocumentTableProps {
  documents: Document[];
  onViewDocument: (url: string) => void;
  viewType: ViewModeType;
  expandedThreads: Set<string>;
  onToggleThread: (threadUrl: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onViewDocument,
  viewType,
  expandedThreads,
  onToggleThread,
}) => {
  const threadGroups = useMemo(() => {
    if (viewType !== ViewMode.THREADED) return null;

    const groups = documents.reduce((acc, doc) => {
      const threadUrl = doc.thread_url || "ungrouped";
      if (!acc[threadUrl]) {
        acc[threadUrl] = {
          key: threadUrl,
          documentCount: 0,
          documents: [],
        };
      }
      acc[threadUrl].documents.push(doc);
      acc[threadUrl].documentCount++;
      return acc;
    }, {} as Record<string, { key: string; documentCount: number; documents: Document[] }>);

    return Object.values(groups);
  }, [documents, viewType]);

  if (viewType === ViewMode.THREADED && threadGroups) {
    return (
      <ThreadedTable
        threadGroups={threadGroups}
        expandedThreads={expandedThreads}
        onToggleThread={onToggleThread}
        onViewDocument={onViewDocument}
      />
    );
  }

  return <FlatTable documents={documents} onViewDocument={onViewDocument} />;
};

export default DocumentTable;
