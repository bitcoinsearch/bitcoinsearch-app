import { EsSearchResponse, SearchQuery } from "@/types";

type BuildQuery = (
  { queryString, size, page, filterFields, sortFields }: SearchQuery,
  url?: string
) => Promise<EsSearchResponse>;

export const buildQueryCall: BuildQuery = async (
  { queryString, size, page, filterFields, sortFields },
  url
) => {
  const appFilterFields = [
    ...filterFields,
    // Application-specific filters
    { field: "type", value: "combined-summary", operation: "exclude" },
  ];

  const aggregations = [
    { field: "authors" },
    { field: "domain" },
    { field: "tags" },
  ];

  const body = {
    queryString,
    size,
    page,
    filterFields: appFilterFields,
    sortFields,
    aggregationFields: aggregations,
  };

  const jsonBody = JSON.stringify(body);

  return fetch(url ?? "/api/elasticSearchProxy/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonBody,
  })
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        const errMessage = data.message || "Error while fetching";
        throw new Error(errMessage);
      }

      return data.data?.result;
    })
    .catch((err) => {
      throw new Error(err.message ?? "Error fetching results");
    });
};
