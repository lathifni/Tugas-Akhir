const { listGeomCulinaryController, listCulinaryByRadiusController, listAllCulinaryController, getCulinaryByIdController, postCulinaryController, putCulinaryByIdController, deleteCulinaryByIdController } = require("../controllers/culinaryController");

const listGeomCulinaryHandler = async(req, res) => {
  try {
    const geom = await listGeomCulinaryController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listCulinaryByRadiusHandler = async(req, res) => {
  try {
    const list = await listCulinaryByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const postCulinaryHandler = async(req, res) => {
  try {
    const input = await postCulinaryController(req.body)
    
    return res.status(201).send({ status:'success test'})
  } catch (error) {
    console.log(error);
  }
}

const putCulinaryByIdHandler = async(req, res) => {
  try {
    const putData = await putCulinaryByIdController(req.body)
    
    return res.status(200).send({ status:'success'})
  } catch (error) {
    console.log(error);
  }
}

const deleteCulinaryByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteCulinaryByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

const listAllCulinaryHandler = async(req, res) => {
  try {
    const list = await listAllCulinaryController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getCulinaryByIdHandler = async(req, res) => {
  try {
    const data = await getCulinaryByIdController(req.params)
    data.icon = 'culinary.png'

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomCulinaryHandler,listCulinaryByRadiusHandler, postCulinaryHandler, putCulinaryByIdHandler, deleteCulinaryByIdHandler
  , listAllCulinaryHandler, getCulinaryByIdHandler,  }