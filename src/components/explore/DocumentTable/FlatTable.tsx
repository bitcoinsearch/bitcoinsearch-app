import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { formatTimeAgo } from "@/utils/dateUtils";
import type { FlatTableProps } from "./types";

export const FlatTable: React.FC<FlatTableProps> = ({
  documents,
  onViewDocument,
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
    <table className="min-w-full border border-custom-stroke">
      <thead>
        <tr className="bg-custom-hover-state dark:bg-custom-hover-primary">
          <th className="px-4 py-2 border-b border-custom-stroke">Title</th>
          <th className="px-4 py-2 border-b border-custom-stroke">URL</th>
          <th className="px-4 py-2 border-b border-custom-stroke">
            Indexed At
          </th>
          <th className="w-10 px-2 py-2 border-b border-custom-stroke"></th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, index) => (
          <tr
            key={doc.id}
            className={
              index % 2 === 0
                ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                : "bg-custom-background"
            }
          >
            <td className="px-4 py-2 border-b border-custom-stroke max-w-xs">
              <div className="truncate" title={doc.title}>
                {doc.title}
              </div>
            </td>
            <td className="px-4 py-2 border-b border-custom-stroke">
              <div className="truncate max-w-md">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-custom-accent hover:underline"
                  title={doc.url}
                >
                  {doc.url && trimUrl(doc.url, doc.domain)}
                </a>
              </div>
            </td>
            <td className="px-4 py-2 border-b border-custom-stroke whitespace-nowrap">
              <div className="group relative inline-block">
                <span>{formatTimeAgo(doc.indexed_at)}</span>
                <span className="invisible group-hover:visible absolute left-0 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm bg-custom-black text-custom-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  {new Date(doc.indexed_at).toLocaleString()}
                </span>
              </div>
            </td>
            <td className="w-10 px-2 py-2 border-b border-custom-stroke text-center">
              <button
                onClick={() => onViewDocument(doc.id)}
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
  );
};
