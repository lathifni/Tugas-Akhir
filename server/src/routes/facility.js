var express = require('express');
const { getAllFacilityHandler, getAllTypeFacilityHandler, postFacilityHandler, getFacilityByIdHandler, putFacilityByIdHandler, deleteFacilityByIdHandler } = require('../handlers/facilityHandler');

var router = express.Router();

router.get('/all', getAllFacilityHandler)
router.get('/allType', getAllTypeFacilityHandler)
router.post('/', postFacilityHandler)
router.get('/:id', getFacilityByIdHandler)
router.put('/:id', putFacilityByIdHandler)
router.delete('/:id', deleteFacilityByIdHandler)

module.exports = router;
