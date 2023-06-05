import React from "react";
import ResultCollection from "./ResultCollection";
import { getDomainGrouping } from "../../config/mapping-helper";
import {
  generateLocator,
  sortGroupedResults,
} from "../../config/results-helper";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import useSearchContext from "../../hooks/useSearchContext";

const CustomResults = ({ clickThroughTags, shouldTrackClickThrough }) => {
  const {
    state: { results },
    trackClickThrough,
  } = useSearchContext();
  const { hiddenBody } = useIsInitialStateWithoutFilter();

  // empty search string or initial page search without filters should not be displayed
  if (hiddenBody) {
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

export default CustomResults;
