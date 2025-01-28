import React, { useState } from "react";
import { formatTimeAgo } from "@/utils/dateUtils";
import Documents from "@/components/explore/Documents";
import NavBar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";
import { useExplore } from "@/hooks/useExplore";
import IndexSelector from "@/components/explore/IndexSelector";
import { IndexType } from "@/config/config";

interface ExplorerField {
  key: string;
  displayName: string;
}

const EXPLORER_CONFIGS: Record<string, ExplorerField> = {
  tags: {
    key: "tags",
    displayName: "Topics",
  },
  authors: {
    key: "authors",
    displayName: "Authors",
  },
  sources: {
    key: "domain",
    displayName: "Sources",
  },
};

const ExplorePage = () => {
  const [activeType, setActiveType] = useState("sources");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<IndexType>("main");

  const config = EXPLORER_CONFIGS[activeType];
  const { data, isLoading, isError, error } = useExplore(
    config.key,
    selectedIndex
  );

  const toggleExpand = (value: string) => {
    setExpandedItem(expandedItem === value ? null : value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-custom-background text-custom-primary-text">
      <NavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Explore Data</h1>
            <IndexSelector
              selectedIndex={selectedIndex}
              onIndexChange={setSelectedIndex}
            />
          </div>

          <div className="flex space-x-1 bg-custom-hover-state dark:bg-custom-hover-primary rounded-lg p-1">
            {Object.entries(EXPLORER_CONFIGS).map(([id, { displayName }]) => (
              <button
                key={id}
                onClick={() => {
                  setActiveType(id);
                  setExpandedItem(null);
                }}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    activeType === id
                      ? "bg-custom-background text-custom-primary-text shadow-sm"
                      : "text-custom-secondary-text hover:text-custom-primary-text"
                  }
                `}
              >
                {displayName}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-custom-stroke">
              <thead>
                <tr className="bg-custom-hover-state dark:bg-custom-hover-primary">
                  <th className="w-8 px-2 py-2 border-b border-custom-stroke"></th>
                  <th className={`px-4 py-2 border-b border-custom-stroke`}>
                    {config.displayName}
                  </th>
                  <th className="px-4 py-2 border-b border-custom-stroke">
                    Documents
                  </th>
                  <th className="px-4 py-2 border-b border-custom-stroke">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item, index) => (
                  <React.Fragment key={item.value}>
                    <tr
                      className={`${
                        index % 2 === 0
                          ? "bg-custom-hover-state dark:bg-custom-hover-primary"
                          : "bg-custom-background"
                      } cursor-pointer hover:bg-custom-hover-state dark:hover:bg-custom-hover-primary`}
                      onClick={() => toggleExpand(item.value)}
                    >
                      <td className="w-8 px-2 py-2 border-b border-custom-stroke">
                        <span className="text-lg">
                          {expandedItem === item.value ? "▼" : "▶"}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke text-custom-accent">
                        {item.value}
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        {item.documentCount}
                      </td>
                      <td className="px-4 py-2 border-b border-custom-stroke">
                        {formatTimeAgo(item.lastScraped)}
                      </td>
                    </tr>
                    {expandedItem === item.value && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-0 border-b border-custom-stroke"
                        >
                          <Documents
                            filterField={config.key}
                            filterValue={item.value}
                            features={item.features}
                            selectedIndex={selectedIndex}
                          />
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

export default ExplorePage;
