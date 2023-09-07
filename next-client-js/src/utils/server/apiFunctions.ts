import type { Facet, SearchQuery } from "@/types";

const FIELDS_TO_SEARCH = ["authors", "title", "body"];

type BuildQueryForElaSticClient = Omit<SearchQuery, "page"> & {
  from: number
}

export const buildQuery = ({queryString, size, from, filterFields, sortFields}: BuildQueryForElaSticClient) => {
  
  let baseQuery = {
    query:{
      bool:{
        must: [],
        should:[],
        filter: [],
      }
    },
    sort: [],
    aggs: {
      authors: {
        terms: {
          field: 'authors.keyword',
          size: 15
        }
      },
      domains: {
        terms: {
          field: 'domain.keyword',
          size: 15
        }
      },
      tags: {
        terms: {
          field: 'tags.keyword',
          size: 15
        }
      }
    },
    size,
    from,
  }

  //Add the clause to the should array
  let shouldClause = buildShouldQueryClause(queryString);
  baseQuery.query.bool.should.push(shouldClause);

  if(filterFields && filterFields.length) {
    for (let facet of filterFields) {
      let mustClause = buildFilterQueryClause(facet);
      baseQuery.query.bool.must.push(mustClause);
    }
  }

  if (sortFields && sortFields.length) {
    for (let field of sortFields) {
      const sortClause = buildSortClause(field)
      baseQuery.sort.push(sortClause)
    }
  }

  return baseQuery;
};

const buildShouldQueryClause = (queryString: string) => {
  let shouldQueryClause = {
    multi_match : {
      query: queryString, 
      fields: FIELDS_TO_SEARCH
    }
  }

  return shouldQueryClause;
}

const buildFilterQueryClause = ({field, value}: Facet) => {
  let filterQueryClause = {
    term: {
      [`${field}.keyword`]: {value} 
    }
  }

  return filterQueryClause;
}

const buildSortClause = ({field, value}: {field: any, value: any}) => {
  return {
    [field]: value
  }
}