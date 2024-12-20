import {
  AggregationsAggregate,
  AggregationsAggregationContainer,
  SearchResponse,
} from "@elastic/elasticsearch/lib/api/types";

export const FACETS = {
  AUTHOR: "authors",
  DOMAIN: "domain",
  TAGS: "tags",
} as const;

export type FacetKeys = (typeof FACETS)[keyof typeof FACETS];

export type FilterOperation = "include" | "exclude";

export type Facet = {
  field: string;
  value: string | string[];
  operation?: FilterOperation;
};

const bodyType = {
  markdown: "markdown",
  raw: "raw",
  html: "html",
  "combined-summary": "combined-summary",
} as const;

type SortOption = {
  field: string;
  value: "asc" | "desc";
};

export interface AggregationField {
  field: string;
  size?: number;
  subAggregations?: Record<string, AggregationsAggregationContainer>; // Raw ES aggregation config
}

export type SearchQuery = {
  queryString: string;
  size: number;
  page: number;
  filterFields: Facet[];
  sortFields: SortOption[];
  aggregationFields?: AggregationField[];
  index?: string;
};

export type EsSearchResult = {
  _id: string;
  _index: string;
  _source: {
    authors: string[];
    body: string;
    body_type: BodyType;
    created_at: Date;
    domain: string;
    id: string;
    indexed_at: Date;
    title: string;
    url: string;
    body_formatted?: string;
    categories?: string[];
    media?: string;
    tags?: string[];
    transcript_by?: string;
    summary?: string;
    thread_url?: string;
    type?: "question" | "reply" | "original_post" | "newsletter";
  };
};

export type BodyType = (typeof bodyType)[keyof typeof bodyType];

export type EsSearchResponse = SearchResponse<
  unknown,
  Record<string, AggregationsAggregate>
>;

export const ViewMode = {
  FLAT: "flat",
  THREADED: "threaded",
  SUMMARIES: "summaries",
} as const;

export type ViewModeType = (typeof ViewMode)[keyof typeof ViewMode];

export interface Source {
  domain: string;
  documentCount: number;
  lastScraped: string;
  hasSummaries: boolean;
  hasThreads: boolean;
}

export interface Document {
  id: string;
  title: string;
  url: string;
  indexed_at: string;
  thread_url?: string;
  domain: string;
  type?: string;
}

export type EsSourcesResponse = Source[];
