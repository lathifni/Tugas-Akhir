const { getAllFacilityController } = require("../controllers/facilityController");

const getAllFacilityHandler = async(req, res) => {
  try {
    const list = await getAllFacilityController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllFacilityHandler, }