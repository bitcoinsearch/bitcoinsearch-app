import mapping from "./mapping.json";

export const getDomainGrouping = () => {
  return mapping.collection;
};

export const getDomainLabel = (domain_url, plainString = false) => {
  const label = mapping?.labels[domain_url] || null;
  if (!plainString) return label;
  return label && typeof label === "string"
    ? label.toLowerCase().replace(/ /g, "_")
    : null;
};
