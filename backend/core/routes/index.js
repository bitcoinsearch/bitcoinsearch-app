const config = require("config");
const glob = require("glob");
const path = require("path");

function loadRoutes(app) {
  glob
    .sync(`${__dirname}/${config.get("api.version")}/*.js`)
    .forEach(function (file) {
      app.use(
        "/api" + config.get("api.version") + "/",
        require(path.resolve(file))
      );
    });
  handle404Error(app);
}

function handle404Error(app) {
  app.use(function (req, res) {
    res.status(404).json({
      success: false,
      statusCode: 'END_POINT_NOT_FOUND',
      message: "The requested end point does not exist",
    });
  });
}

module.exports = {
  init: loadRoutes,
};
