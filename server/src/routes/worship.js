var express = require('express');
const { listGeomWorshipHandler, listWorshipByRadiusHandler, listAllWorshipHandler, getWorshipByIdHandler, postWorshipHandler, deleteWorshipByIdHandler, putWorshipByIdHandler } = require('../handlers/worshipHandler');

var router = express.Router();

router.post('/', postWorshipHandler)
router.get('/geom', listGeomWorshipHandler)
router.get('/listByRadius', listWorshipByRadiusHandler)
router.get('/all', listAllWorshipHandler)
router.get('/:id', getWorshipByIdHandler)
router.put('/:id', putWorshipByIdHandler)
router.delete('/:id', deleteWorshipByIdHandler)

module.exports = router;
