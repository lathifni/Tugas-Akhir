const { listGeomHomestayController, listHomestayByRadiusController, listAllHomestayController, availableHomestayController, bookedHomestayController, getHomestayByIdController, createNewHomestayController, deleteHomestayByIdController, allUnitHomestayByIdController, addFacilityHomestayByIdController, createFacilityHomestayController, createFacilityHomestayUnitController, addFacilityUnitByIdController, addUnitController, deleteFacilityUnitController, editUnitController, updateHomestayController, allReviewControllerById } = require("../controllers/homestayController");
const { getListAllUnitType, getListAllFacilityUnit, getListAllFacilityHomestay, deleteFacilityHomestayById, deleteFacilityUnitDetail } = require("../services/homestay");

const listGeomHomestayHandler = async(req, res) => {
  try {
    const geom = await listGeomHomestayController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listHomestayByRadiusHandler = async(req, res) => {
  try {
    const list = await listHomestayByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllHomestayHandler = async(req, res) => {
  try {
    const list = await listAllHomestayController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const availableHomestayHandler = async(req, res) => {
  try {
    const data = await availableHomestayController(req.query)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const bookedHomestayHandler = async(req, res) => {
  try {
    const data = await bookedHomestayController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const getHomestayByIdHandler = async(req, res) => {
  try {
    const data = await getHomestayByIdController(req.params)
    data.icon = 'homestay.png'

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const createNewHomestayHandler = async(req, res) => {
  try {
    const data = await createNewHomestayController(req.body)

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const deleteHomestayByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteHomestayByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    return res.status(400).send({ status:'failed to deleted data',  })
  } catch (error) {
    console.log(error);
  }
}

const allUnitHomestayByIdHandler = async(req, res) => {
  try {
    const data = await allUnitHomestayByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const allTypeUnitHandler = async(req, res) => {
  try {
    const data = await getListAllUnitType()

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const allFacilityHomestayHandler = async(req, res) => {
  try {
    const data = await getListAllFacilityHomestay()
    console.log('testtt di allFacilityHomestayHandler');
    

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const allFacilityUnitHandler = async(req, res) => {
  try {
    const data = await getListAllFacilityUnit()

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const addFacilityHomestayByIdHandler = async(req, res) => {
  try {    
    const data = await addFacilityHomestayByIdController(req.body)

    return res.status(201).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const deleteFacilityHomestayByIdHandler = async(req, res) => {
  try {
    const { id, facilityId } = req.params
    const data = await deleteFacilityHomestayById({ id, facilityId })

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const createFacilityHomestayHandler = async(req, res) => {
  try {
    const data = await createFacilityHomestayController(req.body)

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
    return res.status(201).send({ status: 'error', message: error.message });
  }
}

const createFacilityHomestayUnitHandler = async(req, res) => {
  try {
    const data = await createFacilityHomestayUnitController(req.body)

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
    return res.status(201).send({ status: 'error', message: error.message });
  }
}

const addFacilityUnitByIdHandler = async(req, res) => {
  try {
    const data = await addFacilityUnitByIdController(req.body)    

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
    return res.status(201).send({ status: 'error', message: error.message });
  }
}

const addUnitHandler = async(req, res) => {
  try {
    const data = await addUnitController(req.body)    

    return res.status(201).send({ status:'success' })
  } catch (error) {
    console.log(error);
    return res.status(201).send({ status: 'error', message: error.message });
  }
}

const deleteFacilityUnitDetailHandler = async(req, res) => {
  try {
    const data = await deleteFacilityUnitDetail(req.body)

    return res.status(204).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const deleteFacilityUnitHandler = async(req, res) => {
  try {
    const data = await deleteFacilityUnitController(req.query)

    return res.status(204).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const updateHomestayHandler = async(req, res) => {
  try {
    const data = await updateHomestayController(req.body)

    return res.status(200).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const updateUnitHandler = async(req, res) => {
  try {
    const data = await editUnitController(req.body)

    return res.status(200).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const allReviewHandlerById = async(req, res) => {
  try {
    const data = await allReviewControllerById(req.body)

    return res.status(200).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler, availableHomestayHandler
  , bookedHomestayHandler ,getHomestayByIdHandler, createNewHomestayHandler, deleteHomestayByIdHandler
  , allUnitHomestayByIdHandler, allTypeUnitHandler, allFacilityUnitHandler, allFacilityHomestayHandler
  , addFacilityHomestayByIdHandler, deleteFacilityHomestayByIdHandler, createFacilityHomestayHandler
  , createFacilityHomestayUnitHandler, addFacilityUnitByIdHandler, addUnitHandler, deleteFacilityUnitDetailHandler
  , deleteFacilityUnitHandler, updateUnitHandler, updateHomestayHandler, allReviewHandlerById, 
 }