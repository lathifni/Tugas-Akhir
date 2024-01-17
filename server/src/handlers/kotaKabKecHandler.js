const { listGeomKotaKabController, listGeomKecController } = require("../controllers/kotaKabKecController");

const listGeomKotaKabHandler = async(req, res) => {
  try {
    const list = await listGeomKotaKabController()

    return res.status(200).send({ status:'success', data: list })
  } catch (error) {
    console.log(error);
  }
}

const listGeomKecHandler = async(req, res) =>{
  try {
    const list = await listGeomKecController()

    return res.status(200).send({ status:'success', data: list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomKecHandler, listGeomKotaKabHandler, }