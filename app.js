/**
 * @name delete-scenario
 * @description Returns success message after deleting (soft-deleting) a scenario
 * @createdOn Feb 16th, 2026
 */

const {
  sendResponse,
  BadRequest,
  HTTP_RESPONSE_CODES,
} = require("utils/api_response_utils");
const { deleteScenario } = require("./deleteScenarioService");
const { API_ERROR_MESSAGE } = require("constants/customConstants");

/**
 * @description Lambda handler for delete scenario.
 *@param {Object} event: API event with body:
 * {
 *   "scenario": "Getsudo/TMMI/Line1_Cycle_V1",
 *   "userName": "Pritam Talukdar"
 * }
 ** @returns {Object}: response sample is detailed below.
 *  Response object sample for success response with status code 200.
 * {
      "message": "Successfully deleted scenario."
 * }
 * In-valid input error with status 400:
    {
      "errorMessage": [<"ValidationError: validation error message”>]
    }
 * Response object sample for any internal server error with status code 500.
    {
      "errorMessage": <"Internal Server Error">
    }
  * HTTP_RESPONSE_CODES info:
    {
      SUCCESS: 200,
      VALIDATION_ERROR: 400,
      INTERNAL_SERVER_ERROR: 500
    }
*/
exports.handler = async (event) => {
  try {
    /**
     * @description Function to validate & delete scenario.
     * @param {Object} event: Input parameters
     * @returns {Object} response - Success message
     */
    const response = await deleteScenario(event);
    console.log("response:", response);
    return sendResponse(HTTP_RESPONSE_CODES.SUCCESS, response);
  } catch (err) {
    console.log("Handler Error:", err);
    let errorMsg = API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    let statusCode = HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
    // Validation errors (BadRequest)
    if (err instanceof BadRequest) {
      statusCode = HTTP_RESPONSE_CODES.BAD_REQUEST;
      errorMsg = err.message
        .split(/,(?=ValidationError:)/)
        .map((e) => e.trim());
      console.log("Validation error messages:", errorMsg);
    }
    return sendResponse(statusCode, { errorMessage: errorMsg });
  }
};