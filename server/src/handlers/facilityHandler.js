const { getAllFacilityController, getAllTypeFacilityController, postFacilityController, getFacilityByIdController, putFacilityByIdController, deleteFacilityByIdController } = require("../controllers/facilityController");

const getAllFacilityHandler = async(req, res) => {
  try {
    const list = await getAllFacilityController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getAllTypeFacilityHandler = async(req, res) => {
  try {
    const list = await getAllTypeFacilityController()
    
    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const postFacilityHandler = async(req, res) => {
  try {
    const input = await postFacilityController(req.body)
    
    return res.status(201).send({ status:'success test'})
  } catch (error) {
    console.log(error);
  }
}

const getFacilityByIdHandler = async(req, res) => {
  try {
    const data = await getFacilityByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const putFacilityByIdHandler = async(req, res) => {
  try {
    const putData = await putFacilityByIdController(req.body)
    
    return res.status(200).send({ status:'success'})
  } catch (error) {
    console.log(error);
  }
}

const deleteFacilityByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteFacilityByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllFacilityHandler, getAllTypeFacilityHandler, postFacilityHandler, getFacilityByIdHandler, putFacilityByIdHandler, deleteFacilityByIdHandler, }