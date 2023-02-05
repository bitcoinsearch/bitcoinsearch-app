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

const locatorForBitcoinTalk = (url) => {
  const topicParams = new URL(url)?.searchParams.get("topic");
  const topicId = topicParams?.length && topicParams?.split(".")[0];
  return topicId || null;
};

const locatorForBitcoinStackExchange = (url) => {
  const urlPath = new URL(url)?.pathname;
  const id = urlPath && urlPath?.split("questions")[1];
  if (!id) return null;
  return id;
};

const appendIdWithDomain = (id, label) => {
  return `${id}_${label}`;
};
