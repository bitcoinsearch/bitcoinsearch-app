import type {
  QueryDslQueryContainer,
  SearchRequest,
} from "@elastic/elasticsearch/lib/api/types";

import { aggregatorSize } from "@/config/config";
import type { AggregationField, Facet, SearchQuery } from "@/types";

const FIELDS_TO_SEARCH = ["authors", "title", "body"];

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
  aggregationFields = [],
}: BuildQueryForElaSticClient) => {
  // Initialize the base structure of the Elasticsearch query
  let baseQuery: SearchRequest = {
    query: {
      bool: {
        must: [],
        should: [],
        filter: [],
        must_not: [],
      },
    },
    sort: [],
    aggs: {},
    size, // Number of search results to return
    from, // Offset for pagination (calculated from page number)
    _source: {
      excludes: ["summary_vector_embeddings", "body_formatted"],
    },
  };

  // Construct and add the full-text search query if provided
  if (queryString) {
    (baseQuery.query.bool.must as QueryDslQueryContainer[]).push(
      buildShouldQueryClause(queryString)
    );
  }

  // Handle filters with exclusions and array values
  if (filterFields?.length) {
    for (const filter of filterFields) {
      const filterClause = buildFilterQueryClause(filter);

      if (filter.operation === "exclude") {
        (baseQuery.query.bool.must_not as QueryDslQueryContainer[]).push(
          filterClause
        );
      } else {
        (baseQuery.query.bool.must as QueryDslQueryContainer[]).push(
          filterClause
        );
      }
    }
  }

  // Add sorting clauses for each specified sort field
  if (sortFields && sortFields.length) {
    for (let field of sortFields) {
      const sortClause = buildSortClause(field);
      (baseQuery.sort as QueryDslQueryContainer[]).push(sortClause);
    }
  }

  // Add aggregations
  baseQuery.aggs = buildAggregations(aggregationFields);
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
const buildFilterQueryClause = (filter: Facet): QueryDslQueryContainer => {
  if (Array.isArray(filter.value)) {
    // Handle OR logic for array values
    return {
      bool: {
        should: filter.value.map((value) => ({
          term: { [`${filter.field}.keyword`]: value },
        })),
        minimum_should_match: 1,
      },
    };
  }

  // Handle non-array values
  return {
    term: { [`${filter.field}.keyword`]: filter.value },
  };
};

// Helper to build sort clauses for sorting results
const buildSortClause = ({ field, value }: { field: any; value: any }) => {
  return {
    [field]: value,
  };
};

// Helper to build aggregations
const buildAggregations = (fields: AggregationField[]) => {
  const aggs = {};

  fields.forEach((aggregation) => {
    // Create the base terms aggregation
    aggs[aggregation.field] = {
      terms: {
        field: `${aggregation.field}.keyword`,
        size: aggregation.size || aggregatorSize,
      },
    };

    // If there are sub-aggregations, add them directly to the terms agg
    if (aggregation.subAggregations) {
      aggs[aggregation.field].aggs = aggregation.subAggregations;
    }
  });

  return aggs;
};
