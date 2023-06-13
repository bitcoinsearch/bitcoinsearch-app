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
          field: 'authors.analyzed',
          size: 15
        }
      }
    }
  }

  //Add the clause to the should array
  let shouldClause = buildShouldQueryClause(queryString);
  baseQuery.query.bool.should.push(shouldClause);

  if(facets.length) {
    for (let facet of facets) {
      let filterClause = buildFilterQueryClause(facet);
      baseQuery.query.bool.filter.push(filterClause);
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