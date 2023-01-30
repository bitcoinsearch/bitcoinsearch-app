import React from "react";
import { withSearch } from "@elastic/react-search-ui";
import ResultCollection from "./ResultCollection";
import { getDomainGrouping, getDomainLabel } from "../../config/mapping-helper";
import "./styles.results.scss";

const CustomResults = ({
  results,
  clickThroughTags,
  shouldTrackClickThrough,
  trackClickThrough,
}) => {
  if (!results || !results.length) {
    return null;
  }

  const formattedResults = [];
  const similarity = {};
  const groupedDomains = getDomainGrouping();
  results.forEach((result) => {
    if (groupedDomains.includes(result.domain.raw)) {
      const idx = formattedResults.length;
      const label = getDomainLabel(result.domain.raw, true);
      const locatorString = label
        ? `${result.title.raw}_${label}`
        : result.title.raw;
      const isSimilarIdx = similarity[locatorString];
      if (isSimilarIdx !== undefined) {
        formattedResults[isSimilarIdx].push({ ...result });
      } else {
        formattedResults.push([{ ...result }]);
        similarity[locatorString] = idx;
      }
    } else {
      formattedResults.push([{ ...result }]);
    }
  });

  const resultProps = {
    clickThroughTags,
    shouldTrackClickThrough,
    trackClickThrough,
  };
  return (
    <div id="results-container">
      {formattedResults.map((result, idx) => (
        <ResultCollection key={idx} result={result} {...resultProps} />
      ))}
    </div>
  );
};

CustomResults.defaultProps = {
  clickThroughTags: [],
  shouldTrackClickThrough: true,
};

export default withSearch(({ results, trackClickThrough }) => ({
  results,
  trackClickThrough,
}))(CustomResults);
