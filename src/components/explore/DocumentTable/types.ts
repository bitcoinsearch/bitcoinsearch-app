import { Document } from "@/types";

export interface ThreadGroup {
  key: string;
  documentCount: number;
  documents: Document[];
}

export interface FlatTableProps {
  onViewDocument: (id: string) => void;
  documents: Document[];
}

export interface ThreadedTableProps {
  onViewDocument: (id: string) => void;
  threadGroups: ThreadGroup[];
  expandedThreads: Set<string>;
  onToggleThread: (threadUrl: string) => void;
}
