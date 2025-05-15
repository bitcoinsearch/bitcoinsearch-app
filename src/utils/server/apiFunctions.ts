import { aggregatorSize } from "@/config/config";
import type { Facet, SearchQuery } from "@/types";
import { externalSources } from "../dummy";
import fs from "fs";

const FIELDS_TO_SEARCH = ["authors", "title", "body", "domains"];

// Omitting 'page' from SearchQuery as 'from' is used for Elasticsearch pagination
type BuildQueryForElaSticClient = Omit<SearchQuery, "page"> & {
  from: number;
};

/**
 * Constructs an Elasticsearch query object for searching documents based on provided criteria.
 * Supports full-text search across multiple fields, filtering by facets, and sorting results.
 */
export const buildQuery = ({
  queryString,
  size,
  from,
  filterFields,
  sortFields,
  utmSource,
}: BuildQueryForElaSticClient) => {
  // Initialize the base structure of the Elasticsearch query
  let baseQuery = {
    query: {
      bool: {
        must: [],
        should: [],
        filter: [],
        must_not: [
          {
            term: {
              "type.keyword": "combined-summary",
            },
          },
        ],
      },
    },
    sort: [],
    aggs: {
      authors: {
        terms: {
          field: "authors.keyword",
          size: aggregatorSize,
        },
      },
      domains: {
        terms: {
          field: "domain.keyword",
          size: aggregatorSize,
        },
      },
      tags: {
        terms: {
          field: "tags.keyword",
          size: aggregatorSize,
        },
      },
    },
    size, // Number of search results to return
    from, // Offset for pagination (calculated from page number)
    _source: {
      excludes: ["summary_vector_embeddings"],
    },
  };

  // Construct and add the full-text search clause
  let shouldClause = buildShouldQueryClause(queryString);
  if (!queryString) {
    baseQuery.query.bool.should.push(shouldClause);
  } else {
    baseQuery.query.bool.must.push(shouldClause);
  }
  if (externalSources.includes(utmSource)) {
    if (filterFields && filterFields.length) {
      for (let facet of filterFields) {
        if (facet.field === "domain") {
          buildDomainQueryClause(baseQuery, facet.value);
        }
      }
    }
  } else {
    if (filterFields && filterFields.length) {
      for (let facet of filterFields) {
        let mustClause = buildFilterQueryClause(facet);
        baseQuery.query.bool.must.push(mustClause);
      }
    }
  }
  // Add filter clauses for each specified filter field

  // Add sorting clauses for each specified sort field
  if (sortFields && sortFields.length) {
    for (let field of sortFields) {
      const sortClause = buildSortClause(field);
      baseQuery.sort.push(sortClause);
    }
  }
  return baseQuery;
};

// Helper to build the should query clause for full-text search
const buildShouldQueryClause = (queryString: string) => {
  let shouldQueryClause = {
    multi_match: {
      query: queryString,
      fields: FIELDS_TO_SEARCH,
    },
  };

  return shouldQueryClause;
};

// Helper to build filter query clauses based on facets
const buildFilterQueryClause = ({ field, value }: Facet) => {
  let filterQueryClause = {
    term: {
      [`${field}.keyword`]: { value },
    },
  };

  return filterQueryClause;
};

const buildDomainQueryClause = (baseQuery, value) => {
  if (!baseQuery.query.bool.filter.length) {
    baseQuery.query.bool.filter.push({ terms: { "domain.keyword": [] } });
  }
  baseQuery.query.bool.filter[0].terms["domain.keyword"].push(value);
};

// Helper to build sort clauses for sorting results
const buildSortClause = ({ field, value }: { field: any; value: any }) => {
  return {
    [field]: value,
  };
};
