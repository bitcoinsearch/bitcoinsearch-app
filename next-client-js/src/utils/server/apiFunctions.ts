import { Facet } from "@/types";

const FIELDS_TO_SEARCH = ["authors", "title", "body"];


export const buildQuery = (queryString: string, facets: Facet[]) => {
  
  let baseQuery = {
    query:{
      bool:{
        must: [],
        should:[],
        filter: [],
      }
    },
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
  }

  //Add the clause to the should array
  let shouldClause = buildShouldQueryClause(queryString);
  baseQuery.query.bool.should.push(shouldClause);

  if(facets && facets.length) {
    for (let facet of facets) {
      let mustClause = buildFilterQueryClause(facet);
      baseQuery.query.bool.must.push(mustClause);
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