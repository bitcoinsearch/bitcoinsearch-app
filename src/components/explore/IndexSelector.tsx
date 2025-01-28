import React from "react";
import { INDEXES, IndexType } from "@/config/config";

interface IndexSelectorProps {
  selectedIndex: IndexType;
  onIndexChange: (index: IndexType) => void;
}

const IndexSelector: React.FC<IndexSelectorProps> = ({
  selectedIndex,
  onIndexChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-custom-secondary-text">Index:</label>
      <select
        value={selectedIndex}
        onChange={(e) => onIndexChange(e.target.value as IndexType)}
        className="text-sm px-2 py-1 bg-custom-background border border-custom-stroke rounded 
          text-custom-secondary-text hover:border-custom-accent focus:border-custom-accent 
          focus:outline-none cursor-pointer transition-colors duration-200"
      >
        {Object.values(INDEXES).map((index) => (
          <option key={index.id} value={index.id}>
            {index.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IndexSelector;
