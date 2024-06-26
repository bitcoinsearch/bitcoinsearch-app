import { EsSearchResult } from "@/types";
import { getDomainLabel } from "./mapping-helper";

type GenerateLocatorArgs = {
  raw_domain: string;
  url: string;
  title: string;
  thread_url?: string;
};

export const generateLocator = ({
  raw_domain,
  url,
  title,
  thread_url,
}: GenerateLocatorArgs) => {
  const label = getDomainLabel(raw_domain, true);
  switch (raw_domain) {
    case "https://bitcointalk.org/": {
      const id = locatorForBitcoinTalk(url) ?? title;
      return appendIdWithDomain(id, label);
    }
    case "https://bitcoin.stackexchange.com": {
      const id = locatorForBitcoinStackExchange(url) ?? title;
      return appendIdWithDomain(id, label);
    }

    default:
      let id = title;
      if (thread_url) {
        id = locathorForThreads(thread_url);
      }
      return appendIdWithDomain(id, label);
  }
};

export const locatorForBitcoinTalk = (url: string) => {
  const topicParams = new URL(url)?.searchParams.get("topic");
  const topicId = topicParams?.length && topicParams?.split(".")[0];
  return topicId || null;
};

export const locatorForBitcoinStackExchange = (url: string) => {
  const urlPath = new URL(url)?.pathname;
  const id = urlPath && urlPath?.split("questions")[1];
  if (!id) return null;
  return id;
};

export const locathorForThreads = (thread_url: string) => {
  return thread_url;
};

export const locatorForMailingList = (url: string) => {
  // TODO: write a more robust regex pattern matching for id
  const id = url.match(/([0-9]){4,}\w+/)[0];
  if (!id) return 0;
  return parseInt(id) ?? 0;
};

const appendIdWithDomain = (id, label) => {
  return `${id}_${label}`;
};

export const sortGroupedResults = (
  groupedIndices: Set<number>,
  results: Array<Array<EsSearchResult["_source"]>>
) => {
  if (groupedIndices.size) {
    groupedIndices.forEach((idx) => {
      const domain = results[idx][0]?.domain;
      results[idx].sort((prevResult, nextResult) => {
        // sort with date by default when applicable
        if (prevResult?.created_at && nextResult?.created_at) {
          return (
            new Date(prevResult.created_at).getTime() -
            new Date(nextResult.created_at).getTime()
          );
        } else if (domain) {
          return domainSorting(domain, prevResult, nextResult);
        } else {
          return 0;
        }
      });
    });
  }
};

const domainSorting = (
  domain: EsSearchResult["_source"]["domain"],
  prev: EsSearchResult["_source"],
  next: EsSearchResult["_source"]
) => {
  if (!prev?.url || !next?.url) return 0;
  switch (domain) {
    case "https://lists.linuxfoundation.org/pipermail/bitcoin-dev/":
      return locatorForMailingList(next.url) - locatorForMailingList(prev.url);
    case "https://lists.linuxfoundation.org/pipermail/lightning-dev/":
      return locatorForMailingList(next.url) - locatorForMailingList(prev.url);
    default:
      return 0;
  }
};
