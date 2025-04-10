import React from "react";
import { ViewMode, ViewModeType } from "@/types";

interface ViewModeSelectorProps {
  viewMode: ViewModeType;
  onViewModeChange: (mode: ViewModeType) => void;
  hasThreads: boolean;
  hasSummaries: boolean;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange,
  hasThreads,
  hasSummaries,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewModeChange(ViewMode.FLAT)}
        className={`px-4 py-2 rounded ${
          viewMode === ViewMode.FLAT
            ? "bg-custom-button text-custom-white"
            : "bg-custom-hover-state text-custom-primary-text"
        }`}
      >
        All Documents
      </button>
      {hasThreads && (
        <button
          onClick={() => onViewModeChange(ViewMode.THREADED)}
          className={`px-4 py-2 rounded ${
            viewMode === ViewMode.THREADED
              ? "bg-custom-button text-custom-white"
              : "bg-custom-hover-state text-custom-primary-text"
          }`}
        >
          Thread View
        </button>
      )}
      {hasSummaries && (
        <button
          onClick={() => onViewModeChange(ViewMode.SUMMARIES)}
          className={`px-4 py-2 rounded ${
            viewMode === ViewMode.SUMMARIES
              ? "bg-custom-button text-custom-white"
              : "bg-custom-hover-state text-custom-primary-text"
          }`}
        >
          Combined Summaries
        </button>
      )}
    </div>
  );
};

export default ViewModeSelector;
