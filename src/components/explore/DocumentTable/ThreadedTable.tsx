import React from "react";
import { ThreadRow } from "./ThreadRow";
import type { ThreadedTableProps } from "./types";

export const ThreadedTable: React.FC<ThreadedTableProps> = ({
  threadGroups,
  expandedThreads,
  onToggleThread,
  onViewDocument,
}) => {
  return (
    <table className="min-w-full border border-custom-stroke">
      <thead>
        <tr className="bg-custom-hover-state dark:bg-custom-hover-primary">
          <th className="w-8 px-2 py-2 border-b border-custom-stroke"></th>
          <th className="px-4 py-2 border-b border-custom-stroke">Thread</th>
          <th className="px-4 py-2 border-b border-custom-stroke">Posts</th>
          <th className="px-4 py-2 border-b border-custom-stroke">
            Last Update
          </th>
        </tr>
      </thead>
      <tbody>
        {threadGroups.map((group, index) => (
          <ThreadRow
            key={group.key}
            threadUrl={group.key}
            documents={group.documents}
            isExpanded={expandedThreads.has(group.key)}
            onToggle={() => onToggleThread(group.key)}
            onViewDocument={onViewDocument}
            index={index}
          />
        ))}
      </tbody>
    </table>
  );
};
