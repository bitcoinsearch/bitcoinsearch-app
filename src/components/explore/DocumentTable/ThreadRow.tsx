import React from "react";
import { FaChevronDown, FaChevronRight, FaRegFileAlt } from "react-icons/fa";
import { formatTimeAgo } from "@/utils/dateUtils";
import { FlatTableProps } from "./types";

interface ThreadRowProps extends FlatTableProps {
  threadUrl: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const ThreadRow: React.FC<ThreadRowProps> = ({
  threadUrl,
  documents,
  isExpanded,
  onToggle,
  onViewDocument,
  index,
}) => {
  const trimUrl = (url: string, domain: string): string => {
    const domainPattern = new RegExp(
      `^(https?:\/\/)?(www\.)?${domain.replace(".", ".")}/?`,
      "i"
    );
    const trimmed = url.replace(domainPattern, "");
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  };

  return (
    <React.Fragment>
      <tr
        className={`${
          index % 2 === 0
            ? "bg-custom-hover-state dark:bg-custom-hover-primary"
            : "bg-custom-background"
        } cursor-pointer hover:bg-custom-hover-state dark:hover:bg-custom-hover-primary`}
        onClick={onToggle}
      >
        <td className="w-8 px-2 py-2 border-b border-custom-stroke">
          <button className="text-custom-primary-text hover:text-custom-accent">
            {isExpanded ? (
              <FaChevronDown className="w-4 h-4" />
            ) : (
              <FaChevronRight className="w-4 h-4" />
            )}
          </button>
        </td>
        <td className="px-4 py-2 border-b border-custom-stroke">
          {threadUrl === "ungrouped" ? (
            <span className="text-custom-secondary-text">
              Ungrouped Documents
            </span>
          ) : (
            <a
              href={threadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-custom-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {documents[0]?.title || threadUrl}
            </a>
          )}
        </td>
        <td className="px-4 py-2 border-b border-custom-stroke">
          {documents.length}
        </td>
        <td className="px-4 py-2 border-b border-custom-stroke">
          {formatTimeAgo(
            Math.max(...documents.map((d) => new Date(d.indexed_at).getTime()))
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={4} className="p-0 border-b border-custom-stroke">
            <div className="pl-8">
              <table className="min-w-full">
                <tbody>
                  {documents.map((doc, docIndex) => (
                    <tr
                      key={doc.url}
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
                          {doc.url && trimUrl(doc.url, doc.domain)}
                        </a>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatTimeAgo(doc.indexed_at)}
                      </td>
                      <td className="w-10 px-2 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDocument(doc.id);
                          }}
                          className="text-custom-accent hover:text-custom-accent-dark"
                          title="View document"
                        >
                          <FaRegFileAlt className="w-5 h-5 inline-block" />
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
  );
};
