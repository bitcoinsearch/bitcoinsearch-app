import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

import { useSourceDocuments } from "@/hooks/useSourceDocuments";
import { useDocumentContent } from "@/hooks/useDocumentContent";
import { formatTimeAgo } from "@/utils/dateUtils";
import DocumentModal from "./DocumentModal";

interface SourceDocumentsProps {
  domain: string;
}

const trimUrl = (url: string, domain: string): string => {
  const domainPattern = new RegExp(
    `^(https?:\/\/)?(www\.)?${domain.replace(".", ".")}/?`,
    "i"
  );
  const trimmed = url.replace(domainPattern, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const Documents: React.FC<SourceDocumentsProps> = ({ domain }) => {
  const [page, setPage] = useState(1);
  const { sourceDocuments, total, isLoading, isError, error } =
    useSourceDocuments(domain, page);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(
    null
  );
  const {
    documentContent,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useDocumentContent(selectedDocumentUrl);

  if (isLoading) return <div>Loading source documents...</div>;
  if (isError)
    return <div>Error loading source documents: {error.message}</div>;

  const totalPages = Math.ceil(total / 10);

  const handleViewDocument = (url: string) => {
    setSelectedDocumentUrl(url);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Documents for {domain}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-custom-stroke">
          <thead>
            <tr className="bg-custom-hover-state dark:bg-custom-hover-primary">
              <th className="px-4 py-2 border-b border-custom-stroke whitespace-nowrap">
                Title
              </th>
              <th className="px-4 py-2 border-b border-custom-stroke whitespace-nowrap">
                URL
              </th>
              <th className="px-4 py-2 border-b border-custom-stroke whitespace-nowrap">
                Indexed At
              </th>
              <th className="w-10 px-2 py-2 border-b border-custom-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {sourceDocuments?.map((doc, index) => (
              <tr
                key={index}
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
                      {trimUrl(doc.url, domain)}
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
                    onClick={() => handleViewDocument(doc.url)}
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
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-custom-button text-custom-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-custom-button text-custom-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <DocumentModal
        isOpen={!!selectedDocumentUrl}
        onClose={() => setSelectedDocumentUrl(null)}
        document={documentContent}
        isLoading={isContentLoading}
        isError={isContentError}
        error={contentError?.message}
      />
    </div>
  );
};

export default Documents;
