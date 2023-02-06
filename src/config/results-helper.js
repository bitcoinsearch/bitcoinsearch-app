import { getDomainLabel } from "./mapping-helper";

export const generateLocator = (raw_domain, url, title) => {
  const label = getDomainLabel(raw_domain, true);
  switch (raw_domain) {
    case "https://bitcointalk.org": {
      const id = locatorForBitcoinTalk(url) ?? title;
      return appendIdWithDomain(id, label);
    }
    case "https://bitcoin.stackexchange.com": {
      const id = locatorForBitcoinStackExchange(url) ?? title;
      return appendIdWithDomain(id, label);
    }
    default:
      return appendIdWithDomain(title, label);
  }
};

export const locatorForBitcoinTalk = (url) => {
  const topicParams = new URL(url)?.searchParams.get("topic");
  const topicId = topicParams?.length && topicParams?.split(".")[0];
  return topicId || null;
};

export const locatorForBitcoinStackExchange = (url) => {
  const urlPath = new URL(url)?.pathname;
  const id = urlPath && urlPath?.split("questions")[1];
  if (!id) return null;
  return id;
};

export const locatorForMailingList = (url) => {
  // TODO: write a more robust regex pattern matching for id
  const id = url.match(/([0-9]){4,}\w+/)[0];
  if (!id) return null;
  return id;
};

const appendIdWithDomain = (id, label) => {
  return `${id}_${label}`;
};

export const sortGroupedResults = (groupedIndices, results) => {
  if (groupedIndices.size) {
    groupedIndices.forEach((idx) => {
      const domain = results[idx][0]?.domain?.raw;

      results[idx].sort((prevResult, nextResult) => {
        // sort with date by default when applicable
        if (prevResult?.created_at.raw && nextResult?.created_at.raw) {
          return (
            new Date(nextResult?.created_at.raw) -
            new Date(prevResult?.created_at.raw)
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

const domainSorting = (domain, prev, next) => {
  if (!prev?.url?.raw || !next?.url?.raw) return 0;
  switch (domain) {
    case "https://lists.linuxfoundation.org/pipermail/bitcoin-dev/":
      return (
        locatorForMailingList(next.url.raw) -
        locatorForMailingList(prev.url.raw)
      );
    case "https://lists.linuxfoundation.org/pipermail/lightning-dev/":
      return (
        locatorForMailingList(next.url.raw) -
        locatorForMailingList(prev.url.raw)
      );
    default:
      return 0;
  }
};
