const { getAllBasePackageController, getListAllServicePackageByIdController, getPackageByIdController, getAverageRatingPackageByIdController, getListPackageActivityByIdController, getListAllGalleryPackageByIdController, getListAllReviewPackageByIdController, getListDayPackageByIdController, getListAllServicePackageController, getLatestIdPackageController, createExtendBookingControoler, createExtendBookingController, listAllPackageController, listAllServicePackageController, getServiceByIdController, postServiceController, deleteServiceController, createNewPackageController, allPackageInformationByIdController, updatePackageInformationController, deletePackageByIdController, exploreOurPackageController, getAllPackageActivityByIdController, exploreMyPackageController, exploreBrowsePackageController } = require("../controllers/packageController");
const { allPackageType } = require("../services/package");

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

const getAllPackageActivityByIdHandler = async(req, res) => {
  try {
    const list = await getAllPackageActivityByIdController(req.params)

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

const listAllPackageHandler = async(req, res) => {
  try {
    const list = await listAllPackageController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllServicePackageHandler = async(req, res) => {
  try {
    const list = await listAllServicePackageController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getServiceByIdHandler = async(req, res) => {
  try {
    const data = await getServiceByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const postServiceHandler = async(req, res) => {
  try {
    const input = await postServiceController(req.body)
    if (input == 1) return res.status(201).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

const deleteServiceHandler = async(req, res) => {
  try {
    const deleteRow = await deleteServiceController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

const allPackageTypeHandler = async(req, res) => {
  try {
    const data = await allPackageType()
    
    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const createNewPackageHandler = async(req, res) => {
  try {    
    const data = await createNewPackageController(req.body)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const allPackageInformationByIdHandler = async(req, res) => {
  try {
    const data = await allPackageInformationByIdController(req.params)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const updatePackageInformationHandler = async(req, res) => {
  try {
    const data = await updatePackageInformationController(req.body)

    return res.status(200).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const deletePackageByIdHandler = async(req, res) => {
  try {
    const data = await deletePackageByIdController(req.params)

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const exploreOurPackageHandler = async(req, res) => {
  try {
    const data = await exploreOurPackageController(req.params)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const exploreBrowsePackageHandler = async(req, res) => {
  try {
    const data = await exploreBrowsePackageController(req.params)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const exploreMyPackageHandler = async(req, res) => {
  try {
    const data = await exploreMyPackageController(req.params)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllBasePackageHandler, getPackageByIdHandler, getListAllServicePackageByIdHandler, getAverageRatingPackageByIdHandler,
getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler, getListDayPackageByIdHandler, 
getListAllServicePackageHandler, getLatestIdPackageHandler, createExtendBookingHandler, listAllPackageHandler, listAllServicePackageHandler,
getServiceByIdHandler, postServiceHandler, deleteServiceHandler, allPackageTypeHandler, createNewPackageHandler,
allPackageInformationByIdHandler, updatePackageInformationHandler, deletePackageByIdHandler, exploreOurPackageHandler
, getAllPackageActivityByIdHandler, exploreMyPackageHandler, exploreBrowsePackageHandler, 
 }