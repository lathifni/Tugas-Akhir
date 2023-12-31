const {
  galleriesGtpController,
} = require("../controllers/galleriesController");

const galleriesGtpHandler = async (req, res) => {
  try {
    const data= await galleriesGtpController();
    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { galleriesGtpHandler };
