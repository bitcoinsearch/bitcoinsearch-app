import React from "react";
import { getResultTags } from "@/config/config-helper";
import FilterTags from "../filterTag/FilterTags";
import sanitizeHtml from "sanitize-html";
import { Parser } from "html-to-react";
import { Thumbnail } from "./Thumbnail";
import mapping from "@/config/mapping.json";
import { getMapping } from "@/config/mapping-helper";
import { getUrlForCombinedSummary } from "@/utils/tldr";
import { TruncateLengthInChar } from "@/config/config";

const htmlToReactParser = new Parser();
const { tldrLists, combinedSummaryTag } = getMapping()

const Result = ({
  result,
  clickThroughTags,
  shouldTrackClickThrough,
  trackClickThrough,
}) => {
  let dateString = null;
  const { url, title, body, domain, id } = result;

  const isTldrCombinedSummary = tldrLists.includes(domain) && title.includes(combinedSummaryTag)
  const mappedUrl = isTldrCombinedSummary ? getUrlForCombinedSummary(url, id) : url

  const createdDate = result.created_at;
  if (createdDate) {
    try {
      const date = new Date(createdDate);
      const [month, day, year] = [
        date.toLocaleString("default", { month: "short" }),
        date.getDate(),
        date.getFullYear(),
      ];
      dateString = `${day} ${month}, ${year}`;
    } catch {
      dateString = null;
    }
  }

  const getBodyData = (result) => {
    switch (result.body_type) {
      case "mardown":
        return body
      case "raw":
        return result?.summary ?? body
      case "html":
        return body
      case "combined_summary":
        return body
      default: {
        try {
          return JSON.parse(`[${body}]`)
            .map((i) => i.text)
            .join(" ")
        } catch {
          return body || result.body_formatted
        }
      }
    }
  }

  const sanitizedBody = sanitizeHtml(
    getBodyData(result).replaceAll("\n", "")
  ).trim()

  const truncatedBody = sanitizedBody.length > TruncateLengthInChar ? sanitizedBody.substring(0, TruncateLengthInChar) + " ..." : sanitizedBody
  const parsedBody = htmlToReactParser.parse(truncatedBody)

  // removed onClickLink
  const onClickLink = () => {
    if (shouldTrackClickThrough) {
      result?.id?.raw && trackClickThrough(result.id.raw, clickThroughTags);
    }
  };

  return (
    <div className="searchresult">
      <h2 className="search-result-link">
        {/* <a onClick={onClickLink} href={result.url.raw}> */}
        <a href={mappedUrl}
          onClick={onClickLink}
          data-umami-event="URL Clicked"
          data-umami-event-src={mappedUrl}>
          {htmlToReactParser.parse(sanitizeHtml(title))}
        </a>
      </h2>
      {/* <a onClick={onClickLink} href={result.url.raw} className="url-display"> */}
      <a href={mappedUrl} 
        onClick={onClickLink}
        className="url-display"
        data-umami-event="URL Clicked"
        data-umami-event-src={mappedUrl}>
        {mappedUrl}
      </a>
      <div className="search-result-body">
        {mapping.media.includes(result?.domain) && (
          <Thumbnail url={result?.media} />
        )}
        <p>
          {parsedBody}
        </p>
      </div>

      <div className="search-result-filter">
        {getResultTags().map((field, idx) => {
          if (result[field])
            return (
              <FilterTags
                key={`${field}_${idx}`}
                field={field}
                options={result[field]}
              />
            );
        })}
        {dateString && <span className="search-result-date">{dateString}</span>}
      </div>
    </div>
  );
};

export default Result;
