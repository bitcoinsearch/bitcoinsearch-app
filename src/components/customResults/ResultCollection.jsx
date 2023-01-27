import React, { useEffect } from "react";
import { useState } from "react";
import Result from "./Result";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiOutlineRectangleStack } from "react-icons/hi2";

const ResultCollection = ({ result, ...resultProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortedResult, setSortedResult] = useState([]);

  useEffect(() => {
    // reverse array to get the oldest post "souce" in the filtered collection
    let newResult = [...result];
    if (newResult.length > 1) {
      newResult.reverse();
    }
    setSortedResult(newResult);
  }, [result]);

  const [initialResult, ...otherResults] = sortedResult;

  return (
    <div className="results-collection">
      {initialResult && <Result result={initialResult} {...resultProps} />}
      {otherResults.length ? (
        <>
          <div>
            <button
              className={`other-results-dropdown ${
                isExpanded ? "expanded" : ""
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <TiArrowSortedDown
                className={`${isExpanded ? "rotate-down" : ""}`}
              />
              {isExpanded ? (
                <HiOutlineRectangleStack />
              ) : (
                <span>{` + ${otherResults.length} ${
                  otherResults.length > 1 ? "results " : "result "
                }`}</span>
              )}
            </button>
          </div>
          <div className={`other-results ${isExpanded ? "expanded" : ""}`}>
            {otherResults.map((result) => (
              <Result key={result.id.raw} result={result} {...resultProps} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ResultCollection;
