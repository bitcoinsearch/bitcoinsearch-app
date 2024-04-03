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
import { EsSearchResult } from "@/types";
import Image from "next/image";
import DateIcon from "../svgs/DateIcon";
import TimeIcon from "../svgs/TimeIcon";

const htmlToReactParser = new (Parser as any)();
const { tldrLists, combinedSummaryTag } = getMapping();

type ResultProps = {
  result: EsSearchResult["_source"];
  clickThroughTags: any;
  shouldTrackClickThrough: boolean;
  trackClickThrough: () => void;
};

const Result = ({
  result,
  clickThroughTags,
  shouldTrackClickThrough,
  trackClickThrough,
}: ResultProps) => {
  let dateString = null;
  const { url, title, body, domain, id } = result;

  const isTldrCombinedSummary =
    tldrLists.includes(domain) && title.includes(combinedSummaryTag);
  const mappedUrl = isTldrCombinedSummary
    ? getUrlForCombinedSummary(url, id)
    : url;

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

  const getBodyData = (result: ResultProps["result"]) => {
    switch (result.body_type) {
      case "markdown":
        return body;
      case "raw":
        return result?.summary ?? body;
      case "html":
        return body;
      case "combined-summary":
        return body;
      default: {
        try {
          return JSON.parse(`[${body}]`)
            .map((i) => i.text)
            .join(" ");
        } catch {
          return body || result.body_formatted;
        }
      }
    }
  };

  const sanitizedBody = sanitizeHtml(
    getBodyData(result).replaceAll("\n", "")
  ).trim();

  const truncatedBody =
    sanitizedBody.length > TruncateLengthInChar
      ? sanitizedBody.substring(0, TruncateLengthInChar) + " ..."
      : sanitizedBody;
  const parsedBody = htmlToReactParser.parse(truncatedBody);

  // removed onClickLink
  // const onClickLink = () => {
  //   if (shouldTrackClickThrough) {
  //     result?.id && trackClickThrough(result.id, clickThroughTags);
  //   }
  // };
console.log(result)
  return (
    <div className="flex flex-col gap-4 p-4 hover:shadow-lg hover:rounded-xl cursor-pointer">
      <div className="flex gap-4 items-center text-base text-custom-grey-dark font-medium ">
        <Image
          alt="website favicon"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
          src={"/demo-chat.png"}
        />
        <p className="">Bitcoin Optech</p>
        <div className="w-[6px] h-[6px] rounded-full bg-custom-grey-dark" />
        <a
          className=""
          href={mappedUrl}
          data-umami-event="URL Clicked"
          data-umami-event-src={mappedUrl}
        >
          {mappedUrl}
        </a>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-[1.375rem] text-custom-black-dark font-semibold">
          <a className="cursor-pointer hover:underline">
            {htmlToReactParser.parse(sanitizeHtml(title))}
          </a>
        </h2>
        <p className="text-lg text-custom-black-light">
          {parsedBody}
          {/* <a className=" text-right w-full flex items-start justify-end -m-1">
            {" "}
            ...show more
          </a> */}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-16 text-base font-semibold text-custom-black-dark">
          {dateString && (
            <div className="flex items-center gap-2">
              <DateIcon />
              <p className="">{dateString}</p>
            </div>
          )}
          {/* <div className="flex items-center gap-2">
            <TimeIcon />
            <p>1 min read</p>
          </div> */}
        </div>
        <div className="flex gap-4 text-base">
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
        </div>
      </div>
    </div>
  );
};

export default Result;
