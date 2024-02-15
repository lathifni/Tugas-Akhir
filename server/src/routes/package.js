var express = require('express');
const { getAllBasePackageHandler, getListAllServicePackageByIdHandler, getPackageByIdHandler, getAverageRatingPackageByIdHandler, getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler, getListDayPackageByIdHandler, getListAllServicePackageHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)
router.get('/packageById/:id', getPackageByIdHandler)
router.get('/listAllServicePackageById/:id', getListAllServicePackageByIdHandler)
router.get('/averageRatingPackageById/:id', getAverageRatingPackageByIdHandler)
router.get('/listPackageActivityById/:id', getListPackageActivityByIdHandler)
router.get('/listAllGalleryPackageById/:id', getListAllGalleryPackageByIdHandler)
router.get('/listAllReviewPackageById/:id', getListAllReviewPackageByIdHandler)
router.get('/listDayPackageById/:id', getListDayPackageByIdHandler)
router.get('/listAllServicePackage', getListAllServicePackageHandler)

module.exports = router;
