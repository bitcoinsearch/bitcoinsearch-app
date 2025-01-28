export const URLSearchParamsKeyword = {
  SEARCH: "search",
  PAGE: "page",
  SIZE: "size",
  FILTER: "filter",
  SORT: "sort",
} as const;

export const defaultParam = {
  size: 25,
};

export const TruncateLengthInChar = 300;
export const TruncateLinkInChar = 50;

export const aggregatorSize = 100;

export const INDEXES = {
  MAIN: {
    id: "main",
    label: "Main",
    indexName: "bitcoin-search-august-23",
  },
  CORE_DEV: {
    id: "coredev",
    label: "Core Dev",
    indexName: "bitcoin-core-august-23",
  },
} as const;

export type IndexType = (typeof INDEXES)[keyof typeof INDEXES]["id"];

export const getIndexConfig = (id: IndexType) => {
  return (
    Object.values(INDEXES).find((index) => index.id === id) ?? INDEXES.MAIN
  );
};
