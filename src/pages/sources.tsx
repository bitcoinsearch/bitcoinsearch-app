import React, { useState, useMemo } from "react";

import NavBar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";
import Documents from "@/components/sources/Documents";
import { useSources } from "@/hooks/useSources";
import { formatTimeAgo } from "@/utils/dateUtils";
import { Source } from "@/types";

const SourcesPage: React.FC = () => {
  const { sources, isLoading, isError, error } = useSources();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Source;
    direction: "ascending" | "descending";
  } | null>(null);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const toggleExpand = (domain: string) => {
    setExpandedSource(expandedSource === domain ? null : domain);
  };

  const sortedSources = useMemo(() => {
    if (!sources) return [];
    const sortableItems = [...sources];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sources, sortConfig]);

  const sortBy = (key: keyof Source) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Source) => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-custom-background text-custom-primary-text">
      <NavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-4">Data Sources</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-custom-stroke">
              <thead>
                <tr className="bg-custom-hover-state dark:bg-custom-hover-primary">
                  <th className="px-4 py-2 border-b border-custom-stroke"></th>
                  <th
                    className="px-4 py-2 border-b border-custom-stroke cursor-pointer"
                    onClick={() => sortBy("domain")}
                  >
                    Domain{getSortIndicator("domain")}
                  </th>
                  <th
                    className="px-4 py-2 border-b border-custom-stroke cursor-pointer"
                    onClick={() => sortBy("lastScraped")}
                  >
                    Last Scraped{getSortIndicator("lastScraped")}
                  </th>
                  <th
                    className="px-4 py-2 border-b border-custom-stroke cursor-pointer"
                    onClick={() => sortBy("documentCount")}
                  >
                    Document Count{getSortIndicator("documentCount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSources.map((source, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={`${
                        index % 2 === 0
                          ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                          : "bg-custom-background"
                      } cursor-pointer hover:bg-custom-hover-state dark:hover:bg-custom-hover-primary`}
                      onClick={() => toggleExpand(source.domain)}
                    >
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        <span className="text-lg">
                          {expandedSource === source.domain ? "▼" : "▶"}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        <a
                          href={source.domain}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-custom-accent hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {source.domain}
                        </a>
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        <div className="group relative inline-block">
                          <span>{formatTimeAgo(source.lastScraped)}</span>
                          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm bg-custom-black text-custom-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                            {new Date(source.lastScraped).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        {source.documentCount}
                      </td>
                    </tr>
                    {expandedSource === source.domain && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-2 border-b border-custom-stroke"
                        >
                          <Documents domain={source.domain} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SourcesPage;
