const { listGeomSouvenirController, listSouvenirByRadiusController, listAllSouvenirController, postSouvenirController, putSouvenirByIdController, getSouvenirByIdController, deleteSouvenirByIdController } = require("../controllers/souvenirController");

const postSouvenirHandler = async(req, res) => {
  try {
    const input = await postSouvenirController(req.body)
    
    return res.status(201).send({ status:'success test'})
  } catch (error) {
    console.log(error);
  }
}

const putSouvenirByIdHandler = async(req, res) => {
  try {
    const putData = await putSouvenirByIdController(req.body)
    
    return res.status(200).send({ status:'success'})
  } catch (error) {
    console.log(error);
  }
}

const listGeomSouvenirHandler = async(req, res) => {
  try {
    const geom = await listGeomSouvenirController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listSouvenirByRadiusHandler = async(req, res) => {
  try {
    const list = await listSouvenirByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllSouvenirHandler = async(req, res) => {
  try {
    const list = await listAllSouvenirController()

  return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getSouvenirByIdHandler = async(req, res) => {
  try {
    const data = await getSouvenirByIdController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const deleteSouvenirByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteSouvenirByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { postSouvenirHandler, putSouvenirByIdHandler, listGeomSouvenirHandler, listSouvenirByRadiusHandler, listAllSouvenirHandler
  , getSouvenirByIdHandler, deleteSouvenirByIdHandler, 
 }