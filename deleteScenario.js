/**
 * @description DB operation to soft-delete scenario (set is_active=false)
 */

const { dbConnect, dbDisconnect } = require("utils/prismaORM");
const { scenariosData } = require("PrismaORM/services/scenariosService");

async function deleteScenarioData(body) {
  
  try {
    const rdb = await dbConnect();
    const scenariosService = new scenariosData(rdb);
    // delete scenario (update is_active=false)
    await scenariosService.deleteScenario(body.scenario); 
  }catch (err) {
    console.log("Error in deleteScenarioData:", err);
    throw err;
  } finally {
    /* Closing the connections */
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { deleteScenarioData };