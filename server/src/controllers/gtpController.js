const { getInfo, getGeom, getAllObject, totalAdmin, totalCustomer, totalBasePackage, totalWorshipPlace, totalCulinaryPlace, totalSouvenirPlace, totalHomestay, totalUnitHomestay, totalEvent, totalAttraction, totalFacility, totalCostumPackage, totalMaxOccupancyHomestay, revenue, packageAnalysis, dayAnalysis, peopleAnalysis, referralAnalysis, allAnnouncement, getLatestIdAnnouncement, newAnnouncement, deleteAnnouncementById, updateAnnouncement, allActiveAnnouncement, dataInformation, dataGalleryGTP, addGtpGallery, updateGtp, deleteGtpGallery } = require("../services/gtp")

const getInfoController = async() => {
  return getInfo()
}

const updateGtpController = async(params) => {
  const { gallery, delete_gallery } = params
  console.log(delete_gallery);

  if (gallery !== undefined) {
    gallery.forEach(async (item) => {
      const paramsGallery = {
        gtp_id: 'GTP01',
        url: item
      };
      await addGtpGallery(paramsGallery);
    });
  }

  if (delete_gallery !== undefined) {
    delete_gallery.forEach(async (item) => {
      const data = { url: item };
      await deleteGtpGallery(data);
    });
  }

  await updateGtp(params)
  
  return
  
}

const getGeomController = async() => {
  return await getGeom()
}

const getAllObjectController = async() => {
  return await getAllObject()
}

const getDataDashboardController = async() => {
  const totalAdminService = await totalAdmin()
  const totalCustomerService = await totalCustomer()
  const totalBasePackageService = await totalBasePackage()
  const totalCustomPackageService = await totalCostumPackage()
  const totalWorshipPlaceService = await totalWorshipPlace()
  const totalCulinaryPlaceService = await totalCulinaryPlace()
  const totalSouvenirPlaceService = await totalSouvenirPlace()
  const totalHomestayService = await totalHomestay()
  const totalUnitHomestayService = await totalUnitHomestay()
  const totalMaxOccupancyHomestayService = await totalMaxOccupancyHomestay()
  const totalEventService = await totalEvent()
  const totalAttractionService = await totalAttraction()
  const totalFacilityService = await totalFacility()

  return {
    total_admin: {total:totalAdminService.total_admin},
    total_custumer: {total:totalCustomerService.total_customer},
    total_base_package: {total:totalBasePackageService.total_base_package},
    total_custom_package: {total:totalCustomPackageService.total_custom_package},
    total_worship_place: {total:totalWorshipPlaceService.total_worship_place},
    total_culinary_place: {total:totalCulinaryPlaceService.total_culinary_place},
    total_souvenir_place: {total:totalSouvenirPlaceService.total_souvenir_place},
    total_homestay: {total:totalHomestayService.total_homestay},
    total_unit_homestay: {total:totalUnitHomestayService.total_unit_homestay},
    total_max_occupancy_homestay: {total:parseInt(totalMaxOccupancyHomestayService.total_max_occupancy_homestay)},
    total_event: {total:totalEventService.total_event},
    total_attraction: {total:totalAttractionService.total_attraction},
    total_facility: {total:totalFacilityService.total_facility},
  }
  // return {
  //   total_admin: {total:totalAdminService.total_admin, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_custumer: {total:totalCustomerService.total_customer, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_base_package: {total:totalBasePackageService.total_base_package, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_custom_package: {total:totalCustomPackageService.total_custom_package, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_worship_place: {total:totalWorshipPlaceService.total_worship_place, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_culinary_place: {total:totalCulinaryPlaceService.total_culinary_place, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_souvenir_place: {total:totalSouvenirPlaceService.total_souvenir_place, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_homestay: {total:totalHomestayService.total_homestay, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_unit_homestay: {total:totalUnitHomestayService.total_unit_homestay, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_max_occupancy_homestay: {total:parseInt(totalMaxOccupancyHomestayService.total_max_occupancy_homestay), icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_event: {total:totalEventService.total_event, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_attraction: {total:totalAttractionService.total_attraction, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  //   total_facility: {total:totalFacilityService.total_facility, icon:`<FontAwesomeIcon icon={faUser} size='2x' />`},
  // }
}

const getDataRevenueController = async() => {
  return await revenue()
}

const getDataPackageAnalysisController = async() => {
  return await packageAnalysis()
}

const getDataDayAnalysisController = async() => {
  return await dayAnalysis()
}

const getDataPeopleAnalysisController = async() => {
  return await peopleAnalysis()
}

const getDataReferralAnalysisController = async() => {
  return await referralAnalysis()
}

const getListAllAnnouncementController = async() => {
  return await allAnnouncement()
}

const getListAllActiveAnnouncementController = async() => {
  return await allActiveAnnouncement()
}

const newAnnouncementController = async(params) => {
  let { lastIdNumber } = await getLatestIdAnnouncement();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `AN${idNumberString}`;
  params.id = id;
  params.gtp_id = 'GTP01'
  return await newAnnouncement(params);
}

const updateAnnouncementController = async(params) => {
  return await updateAnnouncement(params)
}

const deleteAnnouncementController = async(params) => {
  return await deleteAnnouncementById(params)
}

const getInformationController = async() => {
  const gallery = await dataGalleryGTP(); // Mengambil data gallery dalam bentuk array
  const information = await dataInformation(); // Mengambil data information dalam bentuk objek

  // Menggabungkan objek information dan gallery dalam satu objek
  return {
    ...information, // Menyebarkan (spread) atribut-atribut dari information
    gallery // Menambahkan properti gallery yang berisi array gallery
  };
}

module.exports = { 
  getInfoController, getGeomController, getAllObjectController, getDataDashboardController, getDataRevenueController
  , getDataPackageAnalysisController, getDataDayAnalysisController, getDataPeopleAnalysisController
  , getDataReferralAnalysisController, getListAllAnnouncementController, newAnnouncementController
  , deleteAnnouncementController, updateAnnouncementController, getListAllActiveAnnouncementController
  , getInformationController, updateGtpController, 
}