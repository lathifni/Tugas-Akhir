const {
  galleriesGtpController, galleriesFacilityController,
  galleriesWorshipController,
  galleriesCulinaryController,
  galleriesSouvenirController,
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

module.exports = { galleriesGtpHandler, galleriesFacilityHandler, galleriesCulinaryHandler, galleriesWorshipHandler
  , galleriesSouvenirHandler,  };
