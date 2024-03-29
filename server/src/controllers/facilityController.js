const { allFacility } = require("../services/facility")

const getAllFacilityController = async() => {
  return await allFacility()
}

module.exports = { getAllFacilityController, }