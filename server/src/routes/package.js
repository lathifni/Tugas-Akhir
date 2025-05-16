var express = require('express');
const { getAllBasePackageHandler, getListAllServicePackageByIdHandler, getPackageByIdHandler, getAverageRatingPackageByIdHandler, getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler, getListDayPackageByIdHandler, getListAllServicePackageHandler, createExtendBookingHandler, getLatestIdPackageHandler, listAllPackageHandler, listAllServicePackageHandler, getServiceByIdHandler, postServiceHandler, deleteServiceHandler, allPackageTypeHandler, createNewPackageHandler, allPackageInformationByIdHandler, updatePackageInformationHandler, deletePackageByIdHandler, exploreOurPackageHandler, getAllPackageActivityByIdHandler, exploreMyPackageHandler, exploreBrowsePackageHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)
router.get('/explore-our-package', exploreOurPackageHandler)
router.get('/explore-browse-package/:id', exploreBrowsePackageHandler)
router.get('/explore-my-package/:id', exploreMyPackageHandler)
router.get('/all', listAllPackageHandler)
router.get('/allService', listAllServicePackageHandler)
router.get('/packageById/:id', getPackageByIdHandler)
router.get('/listAllServicePackageById/:id', getListAllServicePackageByIdHandler)
router.get('/averageRatingPackageById/:id', getAverageRatingPackageByIdHandler)
router.get('/listPackageActivityById/:id', getListPackageActivityByIdHandler)
router.get('/allActivityById/:id', getAllPackageActivityByIdHandler)
router.get('/listAllGalleryPackageById/:id', getListAllGalleryPackageByIdHandler)
router.get('/listAllReviewPackageById/:id', getListAllReviewPackageByIdHandler)
router.get('/listDayPackageById/:id', getListDayPackageByIdHandler)
router.get('/listAllServicePackage', getListAllServicePackageHandler)
router.post('/createExtendBooking', createExtendBookingHandler)
router.get('/service/:id', getServiceByIdHandler)
router.get('/allPackageInformation/:id', allPackageInformationByIdHandler)
router.put('/', updatePackageInformationHandler)
router.post('/service', postServiceHandler)
router.delete('/service/:id', deleteServiceHandler)
router.get('/allPackageType', allPackageTypeHandler)
router.post('/', createNewPackageHandler)
router.delete('/:id', deletePackageByIdHandler)

module.exports = router;
