import React from "react";
import { withSearch } from "@elastic/react-search-ui";
import ResultCollection from "./ResultCollection";
import { getDomainGrouping } from "../../config/mapping-helper";
import "./styles.results.scss";
import {
  generateLocator,
  sortGroupedResults,
} from "../../config/results-helper";

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
  const groupedIndices = new Set();
  const groupedDomains = getDomainGrouping();

  results.forEach((result) => {
    const raw_domain = result?.domain?.raw ?? null;

    if (groupedDomains.includes(raw_domain)) {
      const idx = formattedResults.length;

      const locatorId = generateLocator(
        raw_domain,
        result.url.raw,
        result.title.raw
      );
      const isSimilarIdx = similarity[locatorId];

      if (isSimilarIdx !== undefined) {
        formattedResults[isSimilarIdx].push({ ...result });
        groupedIndices.add(isSimilarIdx);
      } else {
        formattedResults.push([{ ...result }]);
        similarity[locatorId] = idx;
      }
    } else {
      formattedResults.push([{ ...result }]);
    }
  });

  sortGroupedResults(groupedIndices, formattedResults);

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
