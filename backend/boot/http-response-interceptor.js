/**
 * Modifies response object by adding utility functions on it
 */

const _ = require('lodash');

module.exports = {
  modify: app => {
    app.use((req, res, next) => {
      /**
       * success response
       *
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.success = ({
        data = {},
        message = '',
        meta = null,
        statusCode = 200
      }) => {
        if (_.isUndefined(data)) {
          res.status(statusCode);
          return res.send();
        }

        if (_.isError(data)) {
          // If the error doesn't have a custom .toJSON, use its stack instead
          // otherwise res.json() would turn it into an empty dictionary.
          // If this is production, don't send a response body at all
          if (!_.isFunction(data.toJSON)) {
            if (process.env.NODE_ENV === 'production') {
              return res.sendStatus(statusCode);
            } else {
              res.status(statusCode);
              return res.send(data.stack);
            }
          }
        }

        // Set status code and send response data.
        res.status(statusCode);

        const response = {
          status: statusCode,
          success: true,
          data
        };

        if (message) {
          response.message = message;
        }

        if (meta) {
          response.meta = meta;
        }

        return res.json(response);
      };

      /**
       * error response
       *
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.error = (data = {}, statusCode = 500) => {
        const { code: errorCode = '', message = '', errors = '', stack } = data;
        let errorStack = stack;
        const response = {
          success: false,
          status: statusCode,
          errorCode,
          message
        };

        if (errors) {
          if (errors instanceof Error) {
            response.error = errors.toString();
            errorStack = errors.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>');
          } else if (Array.isArray(errors)) {
            response.errors = errors;
          } else {
            response.errors = errors;
          }
        }

        if (process.env.NODE_ENV !== 'production') {
          response.errorStack = errorStack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>');
        }

        return res.json(response);
      };

      next();
    });
  }
};