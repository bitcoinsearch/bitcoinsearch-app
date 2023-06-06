import { QueryConfig, RequestState } from "@elastic/search-ui";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

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

const connector = new ElasticsearchAPIConnector({
  // Either specify the cloud id or host to connect to elasticsearch
  cloud: {
    id: process.env.CLOUD_ID, // cloud id found under your cloud deployment overview page
  },
  // host: "http://localhost:9200", // host url for the Elasticsearch instance
  index: process.env.INDEX, // index name where the search documents are contained
  apiKey: process.env.API_KEY, // Optional. apiKey used to authorize a connection to Elasticsearch instance.
  // This key will be visible to everyone so ensure its setup with restricted privileges.
  // See Authentication section for more details.
},
  (requestBody, requestState, queryConfig) => {
    // if (!requestState.searchTerm) return requestBody;

    // transforming the query before sending to Elasticsearch using the requestState and queryConfig
    console.log(requestState, queryConfig)
    // requestBody.query = {
    //   multi_match: {
    //     query: requestState.searchTerm,
    //     fields: Object.keys(searchFields).map((fieldName) => {
    //       const weight = searchFields[fieldName].weight || 1;
    //       return `${fieldName}^${weight}`;
    //     })
    //   }
    // };
    const searchBuild = buildQuery(requestState.searchTerm, undefined)
    requestBody.query = searchBuild.query
    requestBody.aggs = searchBuild.aggs
    // requestBody.aggs = {
    //   authors: {
    //     terms: {
    //       field: 'authors.analyzed',
    //       size: 15
    //     }
    //   }
    // }
    console.log("postProcess requestBody Call", requestBody); // logging out the requestBody before sending to Elasticsearch


    return requestBody;
  }
)

export class CustomConnector {
  
  async onSearch(query, options) {
    const response = await fetch("api/elasticSearchProxy/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        options
      })
    });
    return response.json();
  }

  async onAutocomplete(query, options) {
    const response = await fetch("api/elasticSearchProxy/autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        options
      })
    });
    return response.json();
  }
}

// export function createCustomConnector () {
//   async function onSearch(query: RequestState, options: QueryConfig) {
//     const response = await fetch("api/elasticSearchProxy/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         query,
//         options
//       })
//     });
//     return response.json();
//   }

//   async function onAutocomplete(query: RequestState, options: QueryConfig) {
//     const response = await fetch("api/elasticSearchProxy/autocomplete", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         query,
//         options
//       })
//     });
//     return response.json();
//   }

//   return {
//     onSearch,
//     onAutocomplete
//   };
// }

export default connector;


