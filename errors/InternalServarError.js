const { constants } = require('http2');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = { InternalServerError };
