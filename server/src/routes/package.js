var express = require('express');
const { getAllBasePackageHandler, getListAllServicePackageByIdHandler, getPackageByIdHandler, getAverageRatingPackageByIdHandler, getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler, getListDayPackageByIdHandler, getListAllServicePackageHandler, createExtendBookingHandler, getLatestIdPackageHandler, listAllPackageHandler, listAllServicePackageHandler, getServiceByIdHandler, postServiceHandler, deleteServiceHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)
router.get('/all', listAllPackageHandler)
router.get('/allService', listAllServicePackageHandler)
router.get('/packageById/:id', getPackageByIdHandler)
router.get('/listAllServicePackageById/:id', getListAllServicePackageByIdHandler)
router.get('/averageRatingPackageById/:id', getAverageRatingPackageByIdHandler)
router.get('/listPackageActivityById/:id', getListPackageActivityByIdHandler)
router.get('/listAllGalleryPackageById/:id', getListAllGalleryPackageByIdHandler)
router.get('/listAllReviewPackageById/:id', getListAllReviewPackageByIdHandler)
router.get('/listDayPackageById/:id', getListDayPackageByIdHandler)
router.get('/listAllServicePackage', getListAllServicePackageHandler)
router.post('/createExtendBooking', createExtendBookingHandler)
router.get('/service/:id', getServiceByIdHandler)
router.get('/package/:id', )
router.post('/package', )
router.post('/service', postServiceHandler)
router.delete('/service/:id', deleteServiceHandler)

module.exports = router;
