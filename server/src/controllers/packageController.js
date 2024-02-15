const { getListAllBasePackage, getListAllServicePackageById, getPackageById, getAverageRatingPackageById, getPackageActivityById, getListAllGalleryPackageById, getListAllReviewPackageById, getListDayPackageById, getListAllServicePackage } = require("../services/package")

const getAllBasePackageController = async() => {
  return await getListAllBasePackage()
}

const getPackageByIdController = async(params) => {
  return await getPackageById(params)
}

const getListAllServicePackageByIdController = async(params) => {
  return await getListAllServicePackageById(params)
}

const getAverageRatingPackageByIdController = async(params) => {
  // return await getAverageRatingPackageById(params)
  const data =  await getAverageRatingPackageById(params)
  const averageRating = data[0].average_rating !== null ? data[0].average_rating : 0;
  return averageRating
}
const getListPackageActivityByIdController = async(params) => {
  return await getPackageActivityById(params)
}

const getListAllGalleryPackageByIdController = async(params) => {
  return await getListAllGalleryPackageById(params)
}

const getListAllReviewPackageByIdController = async(params) => {
  return await getListAllReviewPackageById(params)
}

const getListDayPackageByIdController = async(params) => {
  return await getListDayPackageById(params)
}

const getListAllServicePackageController = async() => {
  return await getListAllServicePackage()
}

module.exports = { getAllBasePackageController, getPackageByIdController, getListAllServicePackageByIdController, getAverageRatingPackageByIdController,
getListPackageActivityByIdController, getListAllGalleryPackageByIdController, getListAllReviewPackageByIdController,getListDayPackageByIdController, getListAllServicePackageController }