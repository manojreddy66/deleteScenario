/**
 * @description This file contains input validations for delete scenario API
 */

const { emptyInputCheck } = require("utils/common_utils");
const { dbConnect, dbDisconnect } = require("utils/prismaORM");
const { getValidationSchema } = require("./deleteScenarioSchema");
const { scenariosData } = require("schemaValidator/PrismaORM/services/scenariosService");

/**
 * @description Validate input and business rules for delete scenario.
 * @param {Object} body: API input request
 * @returns {Array} errorMessages: List of validation error messages
 *  - Request body must not be empty
 *  - Scenario must exist and be active
 *  - Only creator can delete
 *  - Cannot delete if scenario is Completed (rundown complete)
 */
async function validateInput(body) {
  const errorMessages = [];
  /**
   * @description Validate: request body should not be empty.
   */
  emptyInputCheck(body);
  /**
   * @description Function to validate input request
   */
  validateParams(body, errorMessages);
  //DB validations
  if (!errorMessages.length) {
    await validateScenarioDeletable(body, errorMessages);
  }
  return { errorMessages: [...new Set(errorMessages)] };
}

/**
 * @description Function to validate input request
 * @param {Object} body: API input request
 * @returns {Array} errorMessages: List of validation error messages
 */
function validateParams(body, errorMessages) {
  const schema = getValidationSchema();
  const { error } = schema.validate(body, { abortEarly: false });
  if (error?.details?.length) {
    error.details.forEach((e) => {
      errorMessages.push(`ValidationError: ${e.message}`);
    });
  }
}

/**
 * @description DB validation:
 * 1) Scenario exists AND is active
 * 2) Cannot delete if scenario_status is 'Completed' 
 * 3) Only creator can delete 
 */
async function validateScenarioDeletable(body, errorMessages) {

  try {
  const rdb = await dbConnect();
    const scenariosService = new scenariosData(rdb);
    const scenarioRow = await scenariosService.getScenarioByName(body.scenario);
    // Must exist
    if (!scenarioRow) {
      errorMessages.push("ValidationError: Scenario doesn't exist.");
      return;
    }
    // Must be active 
    const isActive = scenarioRow.is_active;
    if (isActive === false) {
      errorMessages.push("ValidationError: Scenario doesn't exist.");
      return;
    }
    // Block delete if rundown complete
    if (scenarioRow.scenario_status === "Completed") {
      errorMessages.push(
        "ValidationError: Scenario cannot be deleted once rundown is complete."
      );
    }
    // Only creator can delete:
    const creatorName = scenarioRow.user_name;
    const requesterName = body.userName;
    // validate by name
    if (creatorName && requesterName && creatorName !== requesterName) {
      errorMessages.push("ValidationError: Only scenario creator can delete.");
    }
  } catch(err){
     console.log("Error in checkIfScenarioAlreadyExists:", err);
    throw err;
  }finally {
  /* Closing the connections */
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { validateInput };