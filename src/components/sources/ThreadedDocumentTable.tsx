import React from "react";
import { FaEye, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { formatTimeAgo } from "@/utils/dateUtils";
import { Document } from "@/types";

interface ThreadGroup {
  [key: string]: Document[];
}

interface ThreadedDocumentTableProps {
  threadGroups: ThreadGroup;
  expandedThreads: Set<string>;
  onToggleThread: (threadUrl: string) => void;
  onViewDocument: (url: string) => void;
}

const ThreadedDocumentTable: React.FC<ThreadedDocumentTableProps> = ({
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
          <th className="px-4 py-2 border-b border-custom-stroke">
            Thread URL
          </th>
          <th className="px-4 py-2 border-b border-custom-stroke">Documents</th>
          <th className="px-4 py-2 border-b border-custom-stroke">
            Latest Update
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(threadGroups).map(([threadUrl, docs], index) => (
          <React.Fragment key={threadUrl}>
            <tr
              className={
                index % 2 === 0
                  ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                  : "bg-custom-background"
              }
            >
              <td className="w-8 px-2 py-2 border-b border-custom-stroke">
                <button
                  onClick={() => onToggleThread(threadUrl)}
                  className="text-custom-primary-text hover:text-custom-accent"
                >
                  {expandedThreads.has(threadUrl) ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                </button>
              </td>
              <td className="px-4 py-2 border-b border-custom-stroke">
                {threadUrl !== "ungrouped" ? (
                  <a
                    href={threadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom-accent hover:underline"
                  >
                    {threadUrl}
                  </a>
                ) : (
                  <span className="text-custom-secondary-text">
                    Ungrouped Documents
                  </span>
                )}
              </td>
              <td className="px-4 py-2 border-b border-custom-stroke">
                {docs.length}
              </td>
              <td className="px-4 py-2 border-b border-custom-stroke">
                {formatTimeAgo(
                  Math.max(...docs.map((d) => new Date(d.indexed_at).getTime()))
                )}
              </td>
            </tr>
            {expandedThreads.has(threadUrl) && (
              <tr>
                <td colSpan={4} className="p-0 border-b border-custom-stroke">
                  <div className="pl-8">
                    <table className="min-w-full">
                      <tbody>
                        {docs.map((doc, docIndex) => (
                          <tr
                            key={doc.id}
                            className={
                              docIndex % 2 === 0
                                ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                                : "bg-custom-background"
                            }
                          >
                            <td className="px-4 py-2 max-w-xs">
                              <div className="truncate" title={doc.title}>
                                {doc.title}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-custom-accent hover:underline"
                              >
                                {doc.url}
                              </a>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {formatTimeAgo(doc.indexed_at)}
                            </td>
                            <td className="w-10 px-2 py-2 text-center">
                              <button
                                onClick={() => onViewDocument(doc.id)}
                                className="text-custom-accent hover:text-custom-accent-dark"
                                title="View document"
                              >
                                <FaEye className="w-5 h-5 inline-block" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default ThreadedDocumentTable;
