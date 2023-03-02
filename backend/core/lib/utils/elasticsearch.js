/**
 * @type Elasticsearch Utility
 * @desc Utility for connecting to the Elasticsearch database using elasticsearch client
 */

const { Client } = require('@elastic/elasticsearch')
const config = require('config'); // TODO: get pool info from config

/* Connect to the Elasticsearch database */
var state = {
  client: null,
};

exports.connect = async function(mode='API') {
  if (state.client) return;
  
  let cloud_id = config.get('elasticsearch.cloud_id');
  let elasticsearch_api_key = config.get('elasticsearch.api_key');

  const client = await new Client({
    cloud: { id: cloud_id },
    auth: { apiKey: elasticsearch_api_key }
  });
  
  state.client = client;
};

exports.get = function() {
  return state.client;
};