const { getAllBasePackageController, getListAllServicePackageByIdController, getPackageByIdController, getAverageRatingPackageByIdController, getListPackageActivityByIdController, getListAllGalleryPackageByIdController, getListAllReviewPackageByIdController, getListDayPackageByIdController, getListAllServicePackageController, getLatestIdPackageController, createExtendBookingControoler, createExtendBookingController } = require("../controllers/packageController");

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

const getListAllGalleryPackageByIdHandler = async(req, res) => {
  try {
    const list = await getListAllGalleryPackageByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getListAllReviewPackageByIdHandler = async(req, res) => {
  try {
    const list = await getListAllReviewPackageByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getListDayPackageByIdHandler = async(req, res) => {
  try {
    const list = await getListDayPackageByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getListAllServicePackageHandler = async(req, res) => {
  try {
    const list = await getListAllServicePackageController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getLatestIdPackageHandler = async(req, res) => {
  try {
    const data = await getLatestIdPackageController()
    
    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const createExtendBookingHandler = async(req, res) => {
  try {
    const resId = await createExtendBookingController(req.body)

    return res.status(201).send({ status:'success', data:resId })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllBasePackageHandler, getPackageByIdHandler, getListAllServicePackageByIdHandler, getAverageRatingPackageByIdHandler,
getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler, getListDayPackageByIdHandler, 
getListAllServicePackageHandler, getLatestIdPackageHandler, createExtendBookingHandler, }