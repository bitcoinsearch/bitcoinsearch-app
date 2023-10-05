import React from "react";
import useSearchQuery from "@/hooks/useSearchQuery";
import Result from "./Result";

const CustomResults = ({ clickThroughTags, shouldTrackClickThrough }) => {

  const { queryResult } = useSearchQuery();

  const trackClickThrough = () => {
  }

  const formattedResults = [];

  // Using newAPI restrucure data and make it one array deep
  if (queryResult.data?.hits.hits.length) {
    queryResult.data.hits?.hits?.forEach((result) => {
      formattedResults.push({...result["_source"]})
    })
  }

  const resultProps = {
    clickThroughTags,
    shouldTrackClickThrough,
    trackClickThrough,
  };
  return (
    <div id="results-container">
      {formattedResults.map((result, idx) => (
        <Result key={idx} result={result} {...resultProps} />
      ))}
    </div>
  );
};

CustomResults.defaultProps = {
  clickThroughTags: [],
  shouldTrackClickThrough: true,
};

export default CustomResults;
