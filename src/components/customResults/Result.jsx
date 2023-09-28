import React from "react";
import { getResultTags } from "@/config/config-helper";
import FilterTags from "../filterTag/FilterTags";
import sanitizeHtml from "sanitize-html";
import { Parser } from "html-to-react";
import { Thumbnail } from "./Thumbnail";
import mapping from "@/config/mapping.json";

const htmlToReactParser = new Parser();

const Result = ({
  result,
  clickThroughTags,
  shouldTrackClickThrough,
  trackClickThrough,
}) => {
  let dateString = null;
  const { url, title, body } = result;
  
  //PREV const createdDate = result.created_at?.raw || result.created_at?.snippet;
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
        return body
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
        <a href={url}>
          {htmlToReactParser.parse(sanitizeHtml(title))}
        </a>
      </h2>
      {/* <a onClick={onClickLink} href={result.url.raw} className="url-display"> */}
      <a href={url} className="url-display">
        {url}
      </a>
      <div className="search-result-body">
        {mapping.media.includes(result?.domain) && (
          <Thumbnail url={result?.media} />
        )}
        <p>
          {htmlToReactParser.parse(
            sanitizeHtml(
              getBodyData(result).replaceAll("\n", "")
            )
              .substring(0, 300)
              .trim()
          )}
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
