var express = require('express');
const { listGeomCulinaryHandler, listCulinaryByRadiusHandler, listAllCulinaryHandler, getCulinaryByIdHandler, postCulinaryHandler, putCulinaryByIdHandler, deleteCulinaryByIdHandler } = require('../handlers/culinaryHandler');

var router = express.Router();

router.get('/geom', listGeomCulinaryHandler)
router.get('/listByRadius', listCulinaryByRadiusHandler)
router.post('/', postCulinaryHandler)
router.get('/all', listAllCulinaryHandler)
router.get('/:id', getCulinaryByIdHandler)
router.put('/:id', putCulinaryByIdHandler)
router.delete('/:id', deleteCulinaryByIdHandler)

module.exports = router;
