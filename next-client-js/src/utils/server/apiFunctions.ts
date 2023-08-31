const FIELDS_TO_SEARCH = ["authors", "title", "body"];

export type FacetField = {
  field: string;
  value: string;
}

export const buildQuery = (queryString: string, facets: FacetField[]) => {
  
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

const buildShouldQueryClause = (queryString) => {
  let shouldQueryClause = {
    multi_match : {
      query: queryString, 
      fields: FIELDS_TO_SEARCH
    }
  }

  return shouldQueryClause;
}

const buildMustQueryClause = (facet) => {
  let mustQueryClause = {
    term: {
      [facet.field]: {
        value: facet.value
      } 
    }
  }

  return mustQueryClause;
}
const buildFilterQueryClause = (facet: FacetField) => {
  let filterQueryClause = {
    term: {
      [facet.field]: {
        value: facet.value
      } 
    }
  }

  return filterQueryClause;
}