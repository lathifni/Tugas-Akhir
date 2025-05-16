const { getInfoController, getGeomController, getAllObjectController, getDataDashboardController, getDataRevenueController, getDataPackageAnalysisController, getDataDayAnalysisController, getDataPeopleAnalysisController, getDataReferralAnalysisController, getListAllAnnouncementController, newAnnouncementController, deleteAnnouncementController, updateAnnouncementController, getListAllActiveAnnouncementController, getInformationController, updateGtpController } = require("../controllers/gtpController");

const getInfoHandler = async (req, res) => {
  try {
    const info = await getInfoController();

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateGtpHandler = async (req, res) => {
  try {
    const info = await updateGtpController(req.body);

    return res.status(200).send({ status: "success", data: info });
  } catch (error) {
    console.log(error);
    return error;
  }
}

const getGeomHandler = async (req, res) => {
  try {
    const geom = await getGeomController()

    return res.status(200).send({ status:'success', data: geom })
  } catch (error) {
    console.log(error);
  }
}

const getAllObjectHandler = async(req, res) => {
  try {
    const list = await getAllObjectController()

    return res.status(200).send({ status:'success', data: list })
  } catch (error) {
    console.log(error);
  }
}

const getDataDashboardHandler = async(req, res) => {
  try {
    const data = await getDataDashboardController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getDataRevenueHandler = async(req, res) => {
  try {
    const data = await getDataRevenueController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getDataPackageAnalysisHandler = async(req, res) => {
  try {
    const data = await getDataPackageAnalysisController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getDataDayAnalysisHandler = async(req, res) => {
  try {
    const data = await getDataDayAnalysisController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getDataPeopleAnalysisHandler = async(req, res) => {
  try {
    const data = await getDataPeopleAnalysisController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getDataReferralAnalysisHandler = async(req, res) => {
  try {
    const data = await getDataReferralAnalysisController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getListAllAnnouncementHandler = async(req, res) => {
  try {
    const data = await getListAllAnnouncementController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const getListAllActiveAnnouncementHandler = async(req, res) => {
  try {
    const data = await getListAllActiveAnnouncementController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const newAnnouncementHandler = async(req, res) => {
  try {
    const data = await newAnnouncementController(req.body)
    if (data == 1) {
      return res.status(201).send({ status:'success', data: data })
    }
    return res.status(400).send({ status:'not success' })
  } catch (error) {
    console.log(error);
  }
}

const updateAnnouncementHandler = async(req, res) => {
  try {
    const data = await updateAnnouncementController(req.body)
    if (data == 1) {
      return res.status(200).send({ status:'success', data: data })
    }
    return res.status(400).send({ status:'not success' })
  } catch (error) {
    console.log(error);
  }
}

const deleteAnnouncementHandler = async(req, res) => {
  try {
    const data = await deleteAnnouncementController(req.params)
    // return res.status(304).send({ status:'success' })
    if (data == 1) {
      return res.status(200).send({ status:'success' })
    }
    return res.status(400).send({ status:'not success' })
  } catch (error) {
    console.log(error);
  }
}

const getInformationHandler = async(req, res) => {
  try {
    const data = await getInformationController()
    
    return res.status(200).send({ status:'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { 
  getInfoHandler, getGeomHandler, getAllObjectHandler, getDataDashboardHandler, getDataRevenueHandler, getDataPackageAnalysisHandler
  , getDataDayAnalysisHandler, getDataPeopleAnalysisHandler, getDataReferralAnalysisHandler, getListAllAnnouncementHandler
  , newAnnouncementHandler, deleteAnnouncementHandler, updateAnnouncementHandler, getListAllActiveAnnouncementHandler
  , getInformationHandler, updateGtpHandler, 
 }
