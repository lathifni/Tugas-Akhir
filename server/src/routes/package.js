var express = require('express');
const { getAllBasePackageHandler, getListAllServicePackageByIdHandler, getPackageByIdHandler, getAverageRatingPackageByIdHandler, getListPackageActivityByIdHandler, getListAllGalleryPackageByIdHandler, getListAllReviewPackageByIdHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)
router.get('/packageById/:id', getPackageByIdHandler)
router.get('/listAllServicePackageById/:id', getListAllServicePackageByIdHandler)
router.get('/averageRatingPackageById/:id', getAverageRatingPackageByIdHandler)
router.get('/listPackageActivityById/:id', getListPackageActivityByIdHandler)
router.get('/listAllGalleryPackageById/:id', getListAllGalleryPackageByIdHandler)
router.get('/listAllReviewPackageById/:id', getListAllReviewPackageByIdHandler)

module.exports = router;
