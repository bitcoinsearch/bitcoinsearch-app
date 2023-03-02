const elasticsearch = require('@utils/elasticsearch');

async function init(){
  await elasticsearch.connect();
}

async function shutdown() {
  //TODO: need to implement this
}

module.exports = {
  init: init,
  shutdown: shutdown,
  elasticsearch
};