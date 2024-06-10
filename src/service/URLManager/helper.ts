import { URLSearchParamsKeyword } from "@/config/config";
import { getFacetFields, getSortFields } from "@/config/config-helper";
import { Facet } from "@/types";

export const appendFilterName = (filterType: string) => {
  return `${URLSearchParamsKeyword.FILTER}_${filterType}`;
};

export const appendSortName = (sortField: string) => {
  return `${URLSearchParamsKeyword.SORT}_${sortField}`;
};

export function generateFilterQuery(searchParams: string) {
  const filterList: Facet[] = [];
  const urlParams = new URLSearchParams(searchParams);
  getFacetFields().map((field) => {
    const name = appendFilterName(field);
    urlParams.getAll(name).forEach((value) => {
      filterList.push({ field, value });
    });
  });
  return filterList;
}

export function generateSortFields(searchParams: string) {
  const sortList = [];
  const urlParams = new URLSearchParams(searchParams);
  getSortFields().map((field) => {
    const name = appendSortName(field);
    urlParams.getAll(name).forEach((value) => {
      const pair = getSortPairFromValue(value)
      pair && sortList.push(pair);
    });
  });
  return sortList;
}

function getSortPairFromValue(sort: string) {
  const [field, value] = sort.split(":");
  if (!field || !value) return null;
  return {
    field,
    value,
  };
}
