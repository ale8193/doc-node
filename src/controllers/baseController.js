/** Base controller module, containing methods usefull for all controllers
 * @module Controllers/baseController
 */

/**
 * Return a generic success response
 * @param {Object} res - the response object to use to send the error
 * @param {Object} response - a generic json object to return as response body
 */
const successResponse = (res, response) => {
  res.status(200).json(response)
}

/**
 * Return a generic error response
 * @param {Object} res - the response object to use to send the error
 * @param {string} code - the code of the error
 * @param {string} message - the message of the error
 * module:Controllers/baseController~errorResponse
 */
const errorResponse = (res, code, message) => {
  res.status(code).json({
    code,
    message
  })
}

module.exports = {
  successResponse,
  errorResponse
}
