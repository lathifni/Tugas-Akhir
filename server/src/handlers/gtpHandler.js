const { getInfoController } = require("../controllers/gtpController");

const getInfoHandler = async (req, res) => {
  try {
    const info = await getInfoController();

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { getInfoHandler, }
