import { aggregatorSize } from "@/config/config";
import type { Facet, SearchQuery } from "@/types";

const FIELDS_TO_SEARCH = ["title", "body", "authors"];

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
  let mustClause = buildMustQueryClause(queryString);
  if (!queryString) {
    baseQuery.query.bool.should.push(shouldClause);
  } else {
    baseQuery.query.bool.must.push(mustClause);
  }

  // Add filter clauses for each specified filter field
  if (filterFields && filterFields.length) {
    for (let facet of filterFields) {
      let mustClause = buildFilterQueryClause(facet);
      baseQuery.query.bool.must.push(mustClause);
    }
  }

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
const buildMustQueryClause = (queryString: string) => {
  let shouldQueryClause = {
    multi_match: {
      query: queryString,
      fields: FIELDS_TO_SEARCH,
      fuzziness: 0,
      minimum_should_match: "75%",
    },
  };

  return shouldQueryClause;
};

const buildShouldQueryClause = (queryString: string): any => {
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

// Helper to build sort clauses for sorting results
const buildSortClause = ({ field, value }: { field: any; value: any }) => {
  return {
    [field]: value,
  };
};
