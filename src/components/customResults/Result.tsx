import React, { useRef } from "react";
import { getResultTags } from "@/config/config-helper";
import FilterTags from "../filterTag/FilterTags";
import sanitizeHtml from "sanitize-html";
import { Parser } from "html-to-react";
import { getDomainFavicon, getDomainName } from "@/config/mapping-helper";
import { TruncateLengthInChar, TruncateLinkInChar } from "@/config/config";
import { EsSearchResult } from "@/types";
import DateIcon from "../svgs/DateIcon";
import ResultFavicon from "./ResultFavicon";
import { useTheme } from "@/context/Theme";
import { remapUrl } from "@/utils/documents";
import useSearchQuery from "@/hooks/useSearchQuery";

const htmlToReactParser = new (Parser as any)();

type ResultProps = {
  result: EsSearchResult["_source"];
  clickThroughTags: any;
  shouldTrackClickThrough: boolean;
  trackClickThrough: () => void;
};

const Result = ({ result }: ResultProps) => {
  let dateString = null;
  const { url, title, body, domain } = result;
  const { searchQuery } = useSearchQuery();

  const mappedUrl = remapUrl({ url, domain });

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

  const sanitizedBody = sanitizeHtml(getBodyData(result)).trim();

  const strippedUrl = mappedUrl.replace(/^(https?:\/\/)/i, "");
  const truncatedUrl =
    strippedUrl.length > TruncateLinkInChar
      ? strippedUrl.substring(0, TruncateLinkInChar) + "..."
      : strippedUrl;
  const truncatedBody =
    sanitizedBody.length > TruncateLengthInChar
      ? sanitizedBody.substring(0, TruncateLengthInChar) + " ..."
      : sanitizedBody;
  const parsedBody = htmlToReactParser.parse(truncatedBody);
  const siteName = getDomainName(domain);

  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.stopPropagation()
    if (e.target === containerRef?.current) {
      const link = linkRef.current;
      link && link.click();
    }
  };
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      role="link"
      ref={containerRef}
      className="group/heading flex flex-col gap-[12px] 2xl:gap-4 px-1 py-2 lg:p-5 lg:hover:shadow-lg hover:rounded-xl max-w-full lg:max-w-2xl 2xl:max-w-4xl"
      onClick={handleCardClick}
    >
      <div className="flex gap-2 2xl:gap-4 items-center lg:text-xs 2xl:text-base text-custom-otherLight font-medium">
        <ResultFavicon
          key={`${siteName}-dark:${isDark}`}
          src={getDomainFavicon(domain, isDark)}
          alt={`${siteName}-favicon`}
          domain={domain}
          isDark={isDark}
          numbersOfRetry={0}
        />
        <div className="font-geist leading-none font-medium flex flex-wrap flex-col gap-y-[2px] lg:flex-row lg:items-center lg:gap-x-2 2xl:gap-x-4">
          <a
            href={domain}
            className="capitalize text-sm lg:text-base leading-none hover:underline"
          >
            {siteName}
          </a>
          <div className="hidden lg:block w-[2px] h-[2px] lg:w-[6px] lg:h-[6px] rounded-full text-custom-secondary-text bg-custom-black" />
          <a
            target="_blank"
            className="text-[12px] lg:text-base leading-none"
            href={mappedUrl}
            data-umami-event={`${searchQuery}, ${mappedUrl}`}
            data-umami-event-src={mappedUrl}
            ref={linkRef}
          >
            {truncatedUrl}
          </a>
        </div>
      </div>
      <div className="font-mona pointer-events-none flex flex-col gap-2 lg:gap-5 ">
        <h2 className="text-sm lg:text-base 2xl:text-[1.375rem] text-custom-primary-text font-semibold">
          <a
            href={mappedUrl}
            target="_blank"
            className="pointer-events-auto md:group-hover/heading:text-custom-accent cursor-pointer hover:underline"
            data-umami-event={`${searchQuery}, ${mappedUrl}`}
          >
            {htmlToReactParser.parse(sanitizeHtml(title))}
          </a>
        </h2>
        <p className="text-sm lg:text-base 2xl:text-lg text-custom-secondary-text">
          {parsedBody}
        </p>
      </div>
      <div className="pointer-events-none flex flex-col gap-4 md:flex-row md:justify-between xl:gap-12 lg:items-center">
        {dateString && (
          <div className="pointer-events-none flex shrink-0 gap-2 lg:gap-16 text-base font-semibold text-custom-primary-text">
            <div className="flex w-full items-center gap-2 font-mona font-medium text-custom-secondary-text">
              <DateIcon className="flex-shrink-0" />
              <p className="text-[12px] mb-[-2px] whitespace-nowrap lg:text-sm 2xl:text-base leading-none">
                {dateString}
              </p>
            </div>
          </div>
        )}
        <div className={`md:ml-auto pointer-events-auto flex overflow-hidden`}>
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
