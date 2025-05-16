var express = require('express');
const { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler, availableHomestayHandler, bookedHomestayHandler, getHomestayByIdHandler, createNewHomestayHandler, deleteHomestayByIdHandler, allUnitHomestayByIdHandler, allTypeUnitHandler, allFacilityUnitHandler, allFacilityHomestayHandler, addFacilityHomestayByIdHandler, deleteFacilityHomestayByIdHandler, createFacilityHomestayHandler, createFacilityHomestayUnitHandler, addFacilityUnitByIdHandler, addUnitHandler, deleteFacilityUnitDetailHandler, deleteFacilityUnitHandler, updateUnitHandler, updateHomestayHandler, allReviewHandlerById } = require('../handlers/homestayHandler');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler);
router.get('/listByRadius', listHomestayByRadiusHandler);
router.get('/all', listAllHomestayHandler);
router.get('/available-homestay', availableHomestayHandler);
router.get('/booked-homestay/:id', bookedHomestayHandler);
router.get('/for-edit/:id', getHomestayByIdHandler);
router.get('/allUnit/:id', allUnitHomestayByIdHandler);
router.get('/all-facility-homestay', allFacilityHomestayHandler);
router.get('/all-type-unit', allTypeUnitHandler);
router.get('/all-facility-unit', allFacilityUnitHandler);
router.get('/all-review/:id', allReviewHandlerById)
// router.get('/')
router.get('/:id', getHomestayByIdHandler);
router.post('/', createNewHomestayHandler);
router.post('/create-facility-homestay', createFacilityHomestayHandler)
router.post('/create-facility-homestay-unit', createFacilityHomestayUnitHandler)
router.post('/facility-homestay-by-id', addFacilityHomestayByIdHandler);
router.delete('/facility-unit-detail', deleteFacilityUnitDetailHandler);
router.delete('/facility-unit', deleteFacilityUnitHandler)
router.delete('/facility-homestay-by-id/:id/:facilityId', deleteFacilityHomestayByIdHandler);
router.delete('/:id', deleteHomestayByIdHandler);
router.post('/facility-unit-by-id', addFacilityUnitByIdHandler);
router.post('/add-unit', addUnitHandler)
router.put('/', updateHomestayHandler)
router.put('/update-unit', updateUnitHandler)

// router.get('/geom', listGeomHomestayHandler)
// router.get('/listByRadius', listHomestayByRadiusHandler)
// router.get('/all', listAllHomestayHandler)
// router.get('/available-homestay', availableHomestayHandler)
// router.get('/booked-homestay/:id', bookedHomestayHandler)
// router.get('/:id', getHomestayByIdHandler)
// router.get('/for-edit/:id', getHomestayByIdHandler)
// router.get('/allUnit/:id', allUnitHomestayByIdHandler)
// router.post('/', createNewHomestayHandler)
// router.delete('/:id', deleteHomestayByIdHandler)
// router.get('/all-facility-homestayyy', allFacilityHomestayHandler)
// router.get('/all-type-unit', allTypeUnitHandler)
// router.get('/all-facility-unit', allFacilityUnitHandler)
// router.post('/facility-unit', )

module.exports = router;
