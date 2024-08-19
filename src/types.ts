import {
  AggregationsAggregate,
  SearchResponse,
} from "@elastic/elasticsearch/lib/api/types";
const AUTHOR = "authors" as const;
const DOMAIN = "domain" as const;
const TAGS = "tags" as const;

export type FacetKeys = typeof AUTHOR | typeof DOMAIN | typeof TAGS;

export type Facet = {
  field: FacetKeys;
  value: string;
};

const bodyType = {
  markdown: "markdown",
  raw: "raw",
  html: "html",
  "combined-summary": "combined-summary",
} as const;

export type SortOption = "asc" | "desc";

export type SearchQuery = {
  queryString: string;
  size: number;
  page: number;
  filterFields: Facet[];
  sortFields: any[];
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

export interface Source {
  domain: string;
  lastScraped: string;
  documentCount: number;
}

export type EsSourcesResponse = Source[];
