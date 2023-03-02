const logger = require("@utils/logger");

const FIELDS_TO_SEARCH = ["authors", "title", "body"];


const buildQuery = (queryString, facets) => {
  
  let baseQuery = {
    query:{
      bool:{
        must: [],
        should:[]
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

  if(facets) {
    for (let facet of facets) {
      let mustClause = buildMustQueryClause(facet);
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

module.exports.buildQuery = buildQuery;