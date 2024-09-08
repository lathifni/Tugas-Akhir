const { listGeomWorshipController, listWorshipByRadiusController, listAllWorshipController, getWorshipByIdController, postWorshipController, deleteWorshipByIdController, putWorshipByIdController } = require("../controllers/worshipController");


const listGeomWorshipHandler = async(req, res) => {
  try {
    const geom = await listGeomWorshipController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listWorshipByRadiusHandler = async(req, res) => {
  try {
    const list = await listWorshipByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllWorshipHandler = async(req, res) => {
  try {
    const list = await listAllWorshipController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getWorshipByIdHandler = async(req, res) => {
  try {
    const data = await getWorshipByIdController(req.params)
    data.icon = 'worship.png'

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const postWorshipHandler = async(req, res) => {
  try {
    const input = await postWorshipController(req.body)
    
    return res.status(201).send({ status:'success test'})
  } catch (error) {
    console.log(error);
  }
}

const putWorshipByIdHandler = async(req, res) => {
  try {
    const putData = await putWorshipByIdController(req.body)
    
    return res.status(200).send({ status:'success'})
  } catch (error) {
    console.log(error);
  }
}

const deleteWorshipByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteWorshipByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomWorshipHandler, listWorshipByRadiusHandler, listAllWorshipHandler, getWorshipByIdHandler, postWorshipHandler
  , deleteWorshipByIdHandler, putWorshipByIdHandler, 
 }