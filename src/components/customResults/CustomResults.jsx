import React from "react";
import ResultCollection from "./ResultCollection";
import { getDomainGrouping } from "@/config/mapping-helper";
import {
  generateLocator,
  sortGroupedResults,
} from "@/config/results-helper";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import useSearchQuery from "@/hooks/useSearchQuery";
import Result from "./Result";

const CustomResults = ({ clickThroughTags, shouldTrackClickThrough }) => {

  // const { hiddenBody } = useIsInitialStateWithoutFilter();

  const { queryResult } = useSearchQuery();

  const trackClickThrough = () => {

  }

  // empty search string or initial page search without filters should not be displayed
  // if (hiddenBody) {
  //   return null;
  // }

  // formattedResults is an array of array of objects [[{}{}{}]], where similar results are grouped in their arrays
  // unique results will be a single object in their array, [[{}],[{}]]
  const formattedResults = [];
  // similarity {} is a key/value pair, whose key "string" determines similarity
  // and value "number" denotes the nested array index we should append the similar result to
  const similarity = {};
  // contains the indices of arrays that have been grouped "unique indices (set)"
  const groupedIndices = new Set();
  // groupedDomains determines which domain we apply grouping to
  const groupedDomains = getDomainGrouping();

  // results.forEach((result) => {
  //   const raw_domain = result?.domain?.raw ?? null;

  //   if (groupedDomains.includes(raw_domain)) {
  //     const idx = formattedResults.length;

  //     const locatorId = generateLocator(
  //       raw_domain,
  //       result.url.raw,
  //       result.title.raw
  //     );
  //     const isSimilarIdx = similarity[locatorId];

  //     if (isSimilarIdx !== undefined) {
  //       formattedResults[isSimilarIdx].push({ ...result });
  //       groupedIndices.add(isSimilarIdx);
  //     } else {
  //       formattedResults.push([{ ...result }]);
  //       similarity[locatorId] = idx;
  //     }
  //   } else {
  //     formattedResults.push([{ ...result }]);
  //   }
  // });

  // // sort nested arrays (similarResults) by timeCreated if applicable or use another function
  // sortGroupedResults(groupedIndices, formattedResults);

  // Using newAPI restrucure data amd make it one array deep
  if (queryResult.data?.hits.hits.length) {
    queryResult.data.hits?.hits?.forEach((result) => {
      // formattedResults.push([{...result}])
      // console.log({...result["_source"]})
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
        // <ResultCollection key={idx} result={result} {...resultProps} />
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
