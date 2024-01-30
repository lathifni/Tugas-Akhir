const { getAllBasePackageController } = require("../controllers/packageController");

const getAllBasePackageHandler = async(req, res) => {
  try {
    const list = await getAllBasePackageController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllBasePackageHandler, }