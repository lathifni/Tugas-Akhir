const {
  galleriesGtpController, galleriesFacilityController,
  galleriesWorshipController,
  galleriesCulinaryController,
  galleriesSouvenirController,
  galleriesAttractionController,
  galleriesHomestayController,
  galleriesHomestayUnitController,
} = require("../controllers/galleriesController");

const galleriesGtpHandler = async (req, res) => {
  try {
    const data = await galleriesGtpController();

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
    return error;
  }
};

const galleriesFacilityHandler = async(req, res) => {
  try {
    const data = await galleriesFacilityController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const galleriesCulinaryHandler = async(req, res) => {
  try {
    const data = await galleriesCulinaryController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const galleriesWorshipHandler = async(req, res) => {
  try {
    const data = await galleriesWorshipController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const galleriesSouvenirHandler = async(req, res) => {
  try {
    const data = await galleriesSouvenirController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }

}

const galleriesAttractionHandler = async(req, res) => {
  try {
    const data = await galleriesAttractionController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const galleriesHomestayHandler = async(req, res) => {
  try {
    const data = await galleriesHomestayController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const galleriesHomestayUnitHandler = async(req, res) => {
  try {
    const data = await galleriesHomestayUnitController(req.params);

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { galleriesGtpHandler, galleriesFacilityHandler, galleriesCulinaryHandler, galleriesWorshipHandler
  , galleriesSouvenirHandler, galleriesAttractionHandler, galleriesHomestayHandler, galleriesHomestayUnitHandler, };
