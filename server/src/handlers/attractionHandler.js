const { estuaryGeomAttractionController, trackingGeomAttractionController, tripGeomAttractionController, makamGeomAttractionController, waterListGeomAttractionController, cultureListGeomAttractionController, listGeomAttractionController } = require("../controllers/attractionController");

const listGeomAttractionHandler = async(req, res) => {
  try {
    const geom = await listGeomAttractionController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const estuaryGeomAttractionHandler = async(req, res) => {
  try {
    const estuary = await estuaryGeomAttractionController()

    return res.status(200).send({ status:'success', data:estuary })
  } catch (error) {
    console.log(error);
  }
}

const trackingGeomAttractionHandler = async(req, res) => {
  try {
    const tracking = await trackingGeomAttractionController()

    return res.status(200).send({ status:'success', data:tracking })
  } catch (error) {
    console.log(error);
  }
}

const tripGeomAttractionHandler = async(req, res) => {
  try {
    const trip = await tripGeomAttractionController()

    return res.status(200).send({ status:'success', data:trip })
  } catch (error) {
    console.log(error);
  }
}

const makamGeomAttractionHandler = async(req, res) => {
  try {
    const makam = await makamGeomAttractionController()

    return res.status(200).send({ status:'success', data:makam })
  } catch (error) {
    console.log(error);
  }
}

const waterListGeomAttractionHandler = async(req, res) => {
  try {
    const makam = await waterListGeomAttractionController()

    return res.status(200).send({ status:'success', data:makam })
  } catch (error) {
    console.log(error);
  }
}

const cultureListGeomAttractionHandler = async(req, res) => {
  try {
    const makam = await cultureListGeomAttractionController()

    return res.status(200).send({ status:'success', data:makam })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomAttractionHandler, estuaryGeomAttractionHandler, trackingGeomAttractionHandler, tripGeomAttractionHandler, makamGeomAttractionHandler,
waterListGeomAttractionHandler, cultureListGeomAttractionHandler, }