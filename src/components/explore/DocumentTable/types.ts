import { Document } from "@/types";

export interface ThreadGroup {
  key: string;
  documentCount: number;
  documents: Document[];
}

export interface BaseTableProps {
  onViewDocument: (url: string) => void;
  filterField: string;
}

export interface FlatTableProps extends BaseTableProps {
  documents: Document[];
}

export interface ThreadedTableProps extends BaseTableProps {
  threadGroups: ThreadGroup[];
  expandedThreads: Set<string>;
  onToggleThread: (threadUrl: string) => void;
}
