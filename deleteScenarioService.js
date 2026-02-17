/**
 * @description This file contains routing to input validation, DB operations and prepare response
 */

const { BadRequest } = require("utils/api_response_utils");
const { validateInput } = require("./validateRequest");
const { deleteScenarioData } = require("./deleteScenario");
const { prepareResponse } = require("./utils");

/**
 * @description Function to validate & delete scenario.
 * @param {Object} event: API request
 * @returns {Object} response - delete scenario success response
 */
async function deleteScenario(event) {
  try {
    const body = JSON.parse(event?.body || "{}");
    // validate request payload + DB validation
    const { errorMessages } = await validateInput(body);
    if (errorMessages?.length) {
      throw new BadRequest(errorMessages);
    }
    // delete scenario (update is_active=false)
    await deleteScenarioData(body);
    /**
     * @description: Function to prepare response
     * @returns {Object}: success message
     */
    return prepareResponse();
  } catch (err) {
    console.log("Error in deleteScenario:", err);
    throw err;
  }
}

module.exports = { deleteScenario };