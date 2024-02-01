const { getAllBasePackageController, getListAllServicePackageByIdController, getPackageByIdController, getAverageRatingPackageByIdController, getListPackageActivityByIdController } = require("../controllers/packageController");

const getAllBasePackageHandler = async(req, res) => {
  try {
    const list = await getAllBasePackageController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getPackageByIdHandler = async(req, res) => {
  try {
    const list = await getPackageByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getListAllServicePackageByIdHandler = async(req, res) => {
  try {
    const list = await getListAllServicePackageByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getAverageRatingPackageByIdHandler = async(req, res) => {
  try {
    let rating = await getAverageRatingPackageByIdController(req.params)
    
    return res.status(200).send({ status:'success', data:[{average_rating:rating}] })
  } catch (error) {
    console.log(error);
  }
}

const getListPackageActivityByIdHandler = async(req, res) => {
  try {
    const list = await getListPackageActivityByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllBasePackageHandler, getPackageByIdHandler, getListAllServicePackageByIdHandler, getAverageRatingPackageByIdHandler,
getListPackageActivityByIdHandler, }