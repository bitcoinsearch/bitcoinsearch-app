import React from "react";

const IndexSelector = ({ selectedIndex, onIndexChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-custom-secondary-text">Index:</label>
      <select
        value={selectedIndex}
        onChange={(e) => onIndexChange(e.target.value)}
        className="text-sm px-2 py-1 bg-custom-background border border-custom-stroke rounded 
          text-custom-secondary-text hover:border-custom-accent focus:border-custom-accent 
          focus:outline-none cursor-pointer transition-colors duration-200"
      >
        <option value="main">Main</option>
        <option value="coredev">Core Dev</option>
      </select>
    </div>
  );
};

export default IndexSelector;
