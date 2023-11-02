import React from "react";
import ResultCollection from "./ResultCollection";
import useSearchQuery from "@/hooks/useSearchQuery";
import Result from "./Result";
import { getDomainGrouping } from "@/config/mapping-helper";
import { EsSearchResult } from "@/types";
import {
  generateLocator,
  sortGroupedResults,
} from "../../config/results-helper.js";

const CustomResults = ({ clickThroughTags, shouldTrackClickThrough }) => {

  const { queryResult } = useSearchQuery();

  const trackClickThrough = () => {
  }

  const formattedResults = [] as Array<EsSearchResult["_source"]>[];
  const similarity = {};
  const groupedIndices = new Set();
  const groupedDomains = getDomainGrouping();

  const results = queryResult.data?.hits?.hits ?? []
  // Using newAPI restrucure data and make it one array deep
  // if (queryResult.data?.hits.hits.length) {
  //   queryResult.data.hits?.hits?.forEach((result) => {
  //     formattedResults.push({...result["_source"]})
  //   })
  // }
  results.forEach((item) => {
    const result = item._source as EsSearchResult["_source"]
    const raw_domain = result.domain;

    if (groupedDomains.includes(raw_domain)) {
      const idx = formattedResults.length;

      const locatorId = generateLocator(
        raw_domain,
        result.url,
        result.title
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
