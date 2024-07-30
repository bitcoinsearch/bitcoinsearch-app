import React, { useState, useMemo } from "react";
import NavBar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";
import { useSources } from "@/hooks/useSources";
import { Source } from "@/types";

const formatTimeAgo = (date: string | number) => {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    if (diffHours === 0) return "Less than an hour ago";
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const SourcesPage: React.FC = () => {
  const { sources, isLoading, isError, error } = useSources();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Source;
    direction: "ascending" | "descending";
  } | null>(null);

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
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                        : "bg-custom-background"
                    }
                  >
                    <td className="px-4 py-2 border-b border-custom-stroke">
                      {source.domain}
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
