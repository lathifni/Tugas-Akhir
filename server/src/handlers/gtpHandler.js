const { getInfoController, getGeomController } = require("../controllers/gtpController");

const getInfoHandler = async (req, res) => {
  try {
    const info = await getInfoController();

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getGeomHandler = async (req, res) => {
  try {
    const geom = await getGeomController()

    return res.status(200).send({ status:'success', data: geom })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getInfoHandler, getGeomHandler, }
