/* Start API server on the specified port */

const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const response = require('./http-response-interceptor');
const logger = require('@utils/logger');

const MAX_BODY_SIZE = config.get('server.http_max_body_size');

let server;

function setupServer(app) {

  server = http.createServer(app);

  app.use(
    bodyParser.urlencoded({ extended: false })
  );
  app.use(bodyParser.json({ limit: MAX_BODY_SIZE }));

  /* Check CORS before proceeding further */
  app.use(
    cors({
      origin: function (origin, callback) {
        if (
          config.get('cors.whitelist').indexOf(origin) !== -1 ||
          config.get('cors.allowLocal')
        ) {
          // error - null, allowOrigin - true
          callback(null, true);
        } else {
          app.use(function (err, req, res) {
            res.status(403).json({
              success: false,
              statusCode: 'NOT_ALLOWED_BY_CORS',
              message: 'You are not allowed to access this resource',
              data: {},
            });
          });
          // error - true, allowOrigin - false
          callback(true, false);
        }
      },
    })
  );

  /* Add additional http flags in response header for security */
  app.use(helmet());

  response.modify(app);

  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Up and running!' });
  });

  //app.use(_preAuth); // use fakeAuth while testing

  /* Allow reverse proxy such as NginX, AWS ELB */
  app.enable('trust proxy');

  server.listen(config.get('api.port'));
  server.timeout = config.get('server.timeout');
}

function shutdown() {
  //TODO: Implement this
  server.close(() => {});
}

module.exports = {
  init: setupServer,
  shutdown: shutdown,
};
