require('module-alias/register');

// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
//   require('newrelic');
// }

const express = require('express');
const minimist = require('minimist');

const Boot= require('./boot');

const Core = require('./core');

const app = express();
const parsedArgs = minimist(process.argv.slice(2));

(async () => {
  app.parsedArgs = parsedArgs;

  // Initialize the app setups
  await Boot.init(app, parsedArgs);

  // Core module
  await Core.init(app, parsedArgs.mode); 


})();