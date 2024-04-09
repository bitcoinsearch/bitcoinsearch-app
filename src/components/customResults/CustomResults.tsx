import React from "react";
import ResultCollection from "./ResultCollection";
import useSearchQuery from "@/hooks/useSearchQuery";
import { getDomainGrouping } from "@/config/mapping-helper";
import { EsSearchResult } from "@/types";
import {
  generateLocator,
  sortGroupedResults,
} from "../../config/results-helper";

const CustomResults = ({ clickThroughTags, shouldTrackClickThrough }) => {
  const { queryResult } = useSearchQuery();

  const trackClickThrough = () => {};

  const formattedResults = [] as Array<EsSearchResult["_source"]>[];
  const similarity = {};
  const groupedIndices: Set<number> = new Set();
  const groupedDomains = getDomainGrouping();

  const results = queryResult.data?.hits?.hits ?? [];

  results.forEach((item) => {
    const result = item._source as EsSearchResult["_source"];
    const raw_domain = result.domain;

    if (groupedDomains.includes(raw_domain)) {
      const idx = formattedResults.length;

      const locatorId = generateLocator(raw_domain, result.url, result.title);
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
    <div className="flex flex-col">
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
