/**
 * @type Elasticsearch Utility
 * @desc Utility for connecting to the Elasticsearch database using elasticsearch client
 */

const { Client } = require('@elastic/elasticsearch')
const config = require('config'); // TODO: get pool info from config
const dotenv = require('dotenv');
const environment = dotenv.config();

/* Connect to the Elasticsearch database */
var state = {
  client: null,
};

exports.connect = async function(mode='API') {
  if (state.client) return;
  
  let cloud_id = environment.parsed.CLOUD_ID;
  let username = environment.parsed.USERNAME;
  let password = environment.parsed.PASSWORD;

  const client = await new Client({
    cloud: { id: cloud_id },
    auth: { username, password }
  });
  
  state.client = client;
};

exports.get = function() {
  return state.client;
};