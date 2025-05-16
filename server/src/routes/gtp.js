var express = require('express');
const { getInfoHandler, getGeomHandler, getAllObjectHandler, getDataDashboardHandler, getDataRevenueHandler, getDataPackageAnalysisHandler, getDataDayAnalysisHandler, getDataPeopleAnalysisHandler, getDataReferralAnalysisHandler, getListAllAnnouncementHandler, newAnnouncementHandler, deleteAnnouncementHandler, updateAnnouncementHandler, getListAllActiveAnnouncementHandler, getInformationHandler, updateGtpHandler } = require('../handlers/gtpHandler');

var router = express.Router();

router.get('/', getInfoHandler)
router.put('/', updateGtpHandler)
router.get('/geom', getGeomHandler)
router.get('/allObject', getAllObjectHandler)
router.get('/dashboard', getDataDashboardHandler)
router.get('/revenue', getDataRevenueHandler)
router.get('/package-analysis', getDataPackageAnalysisHandler)
router.get('/day-analysis', getDataDayAnalysisHandler)
router.get('/people-analysis', getDataPeopleAnalysisHandler)
router.get('/referral-analysis', getDataReferralAnalysisHandler)
router.get('/list-all-announcement', getListAllAnnouncementHandler)
router.get('/list-all-active-announcement', getListAllActiveAnnouncementHandler)
router.post('/announcement', newAnnouncementHandler)
router.put('/announcement', updateAnnouncementHandler)
router.delete('/announcement/:id', deleteAnnouncementHandler)
router.get('/information', getInformationHandler)

module.exports = router;
