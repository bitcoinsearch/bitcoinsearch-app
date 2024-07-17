import useSearchQuery from "@/hooks/useSearchQuery";
import React from "react";

const ResultSize = () => {
  const {
    resultsPerPage: currentSize,
    totalResults,
    current,
  } = useSearchQuery().pagingInfo;

  const range = {
    start: Math.max(currentSize * (current - 1), 1),
    end: Math.min(currentSize * current, totalResults),
  };
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 pb-5 md:pb-9 text-custom-primary-text text-sm lg:text-base">
        <span>Showing</span>
        <span className="font-bold">
          {range.start} - {range.end}
        </span>
        of <span className="font-bold">{totalResults}</span> results
      </div>
      <div className="group-data-[no-border='true']:hidden border-b border-custom-stroke"></div>
    </>
  );
};

export default ResultSize;
