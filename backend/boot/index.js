const HttpServer = require('./http-server');
const logger = require('@utils/logger');
const config = require('config');
const elasticsearch = require('./elasticsearch');

async function initialize(app, parsedArgs) {
  await elasticsearch.init();
  await HttpServer.init(app);
  logger.info({ description: `Backend API running on ${config.get('api.port')} 🔥` });
  return true;
}

async function shutdown() {
  //TODO: call each of the infra elements shutdown functions
}

module.exports = {
  init: initialize,
  shutdown: shutdown,
};
