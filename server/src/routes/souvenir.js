var express = require('express');
const { listGeomSouvenirHandler, listSouvenirByRadiusHandler, listAllSouvenirHandler, postSouvenirHandler, putSouvenirByIdHandler, getSouvenirByIdHandler, deleteSouvenirByIdHandler } = require('../handlers/souvenirHandler');
const { getSouvenirByIdController } = require('../controllers/souvenirController');

var router = express.Router();

router.post('/', postSouvenirHandler)
router.get('/geom', listGeomSouvenirHandler)
router.get('/listByRadius', listSouvenirByRadiusHandler)
router.get('/all', listAllSouvenirHandler)
router.get('/:id', getSouvenirByIdHandler)
router.put('/:id', putSouvenirByIdHandler)
router.delete('/:id', deleteSouvenirByIdHandler)

module.exports = router;
