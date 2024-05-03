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

export const getDomainFavicon = (domain_url: string, isDark: boolean) => {
  const url = new URL(domain_url);
  const baseUrl = url.origin;
  const iconMapping = mapping.icon[baseUrl];
  if (iconMapping) {
    if (typeof iconMapping === "object") {
      return isDark ? iconMapping.dark : iconMapping.light;
    } else if (typeof iconMapping === "string") {
      return iconMapping;
    }
  }
  return baseUrl + "/favicon.ico";
};

export const fetchDomainFavicon = (domain_url: string): Promise<string> => {
  const url = new URL(domain_url).origin;
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      // Create a temporary DOM element to parse the HTML
      const temp = document.createElement("div");
      temp.innerHTML = html;

      // Find all <link> elements with rel="icon" or rel="shortcut icon"
      const links: NodeListOf<HTMLLinkElement> = temp.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]'
      );

      // If found, return the href attribute of the first matching <link> element
      if (links.length > 0) {
        return url + links[0].getAttribute("href");
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
};

export const deriveNameFromUrl = (domain_url: string, ) => {
  try {
    let title;
    const newUrl = new URL(domain_url);
    const { hostname, pathname } = newUrl;
    if (newUrl.hostname === "github.com") {
      title = pathname
        .split("/")
        .slice(1, 3)
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
    return null;
  }
};

export const getMapping = () => {
  return mapping;
};

export const getDomainName = (domain: string) => {
  // get site name from mapping.json if it exists
  const mappedDomainName = getMappedDomainName(domain);
  if (mappedDomainName) return mappedDomainName;

  const fullDomainName = deriveNameFromUrl(domain);
  if (fullDomainName) return fullDomainName

  // Regex finds the site name e.g google.com will return google
  const siteName =
    typeof domain === "string"
      ? domain.match(
          /(?:https?:\/\/)?(?:www\.)?([^./]+)\.(?:com|org|nl|co\.uk)/
        )
      : "";
  return siteName[1] ?? domain;
};

const getMappedDomainName = (mappedUrl: string): string | undefined => {
  return mapping.labels[mappedUrl];
};
