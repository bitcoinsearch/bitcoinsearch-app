import mapping from "./mapping.json";

const tldRegex = /\.[a-z]{2,}(?:\.[a-z]{2})?$/;

export const getDomainGrouping = () => {
  return mapping.collection;
};

export const getDomainLabel = (domain_url: string, plainString = false) => {
  const label = mapping?.labels[domain_url] || domain_url;
  if (!plainString) return label;
  return label && typeof label === "string"
    ? label.toLowerCase().replace(/ /g, "_")
    : null;
};

export const getDomainFavicon = (domain_url: string) => {
  const url = new URL(domain_url);

  return url.origin + "/favicon.ico";
};

export const deriveNameFromUrl = (domain_url: string) => {
  try {
    let title;
    const newUrl = new URL(domain_url);
    const { hostname, pathname } = newUrl;
    if (newUrl.hostname === "github.com") {
      title = pathname
        .split("/")
        .slice(1)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      const domainWithoutTld = hostname.replace(tldRegex, "");
      title = domainWithoutTld
        .split(".")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    }
    if (typeof title !== "string" || !title.trim()) {
      throw new Error();
    }
    return title;
  } catch (err) {
    return domain_url;
  }
};

export const getMapping = () => {
  return mapping;
};
