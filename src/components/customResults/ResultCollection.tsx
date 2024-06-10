import React, { useEffect } from "react";
import { useState } from "react";
import Result from "./Result";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { EsSearchResult } from "@/types";

type ResultCollectionProps = {
  result: Array<EsSearchResult["_source"]>;
  clickThroughTags: any;
  shouldTrackClickThrough: boolean;
  trackClickThrough: () => void;
};

const ResultCollection = ({
  result,
  ...resultProps
}: ResultCollectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [initialResult, ...otherResults] = result;

  return (
    <div className="results-collection group/other" data-expanded={isExpanded}>
      {initialResult && <Result result={initialResult} {...resultProps} />}
      {otherResults.length ? (
        <>
          <div className="lg:px-3">
            <button
              className={`other-results-dropdown text-custom-accent group-data-[expanded=true]/other:bg-custom-accent hover:bg-custom-accent hover:text-custom-white group-data-[expanded=true]/other:text-custom-white`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <TiArrowSortedDown
                className={`${isExpanded ? "rotate-down" : ""}`}
              />
              {isExpanded ? (
                <HiOutlineRectangleStack />
              ) : (
                <span className="font-">{` + ${otherResults.length} ${
                  otherResults.length > 1 ? "results " : "result "
                }`}</span>
              )}
            </button>
          </div>
          <div className={`other-results ${isExpanded ? "expanded" : ""}`}>
            {otherResults.map((result) => (
              <Result key={result.id} result={result} {...resultProps} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ResultCollection;
