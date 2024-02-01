var express = require('express');
const { getAllBasePackageHandler, getListAllServicePackageByIdHandler, getPackageByIdHandler, getAverageRatingPackageByIdHandler, getListPackageActivityByIdHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)
router.get('/packageById/:id', getPackageByIdHandler)
router.get('/listAllServicePackageById/:id', getListAllServicePackageByIdHandler)
router.get('/averageRatingPackageById/:id', getAverageRatingPackageByIdHandler)
router.get('/listPackageActivityById/:id', getListPackageActivityByIdHandler)

module.exports = router;
