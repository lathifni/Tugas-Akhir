const {
  getListAllBasePackage,
  getListAllServicePackageById,
  getPackageById,
  getAverageRatingPackageById,
  getPackageActivityById,
  getListAllGalleryPackageById,
  getListAllReviewPackageById,
  getListDayPackageById,
  getListAllServicePackage,
  getLatestIdPackage,
  createExtendBooking,
  createPackageDay,
  createPackageActivites,
  createPackageService,
  listAllPackage,
  listAllServicePackage,
  serviceById,
  addService,
  getLatestIdService,
  deleteService,
} = require("../services/package");

const getAllBasePackageController = async () => {
  return await getListAllBasePackage();
};

const getPackageByIdController = async (params) => {
  return await getPackageById(params);
};

const getListAllServicePackageByIdController = async (params) => {
  return await getListAllServicePackageById(params);
};

const getAverageRatingPackageByIdController = async (params) => {
  // return await getAverageRatingPackageById(params)
  const data = await getAverageRatingPackageById(params);
  const averageRating =
    data[0].average_rating !== null ? data[0].average_rating : 0;
  return averageRating;
};
const getListPackageActivityByIdController = async (params) => {
  return await getPackageActivityById(params);
};

const getListAllGalleryPackageByIdController = async (params) => {
  return await getListAllGalleryPackageById(params);
};

const getListAllReviewPackageByIdController = async (params) => {
  return await getListAllReviewPackageById(params);
};

const getListDayPackageByIdController = async (params) => {
  return await getListDayPackageById(params);
};

const getListAllServicePackageController = async () => {
  return await getListAllServicePackage();
};

const createExtendBookingController = async (params) => {
  const { packageDay, packageActivities, packageService, dataPackageById} = params
  const latestIdPackage = await getLatestIdPackage();
  let lastIdNumber = latestIdPackage.lastIdNumber

  const generateId = () => {
    lastIdNumber++;
    const idNumberString = lastIdNumber.toString().padStart(4, "0");
    return `P${idNumberString}`;
  };
  const newId = generateId();
  const newPackage = {
    id: newId,
    name: dataPackageById[0].name,
    type_id: dataPackageById[0].type_id,
    min_capacity: dataPackageById[0].min_capacity,
    price: dataPackageById[0].price,
    contact_person: dataPackageById[0].contact_person,
    description: dataPackageById[0].description,
    custom: 1,
  }

  await createExtendBooking(newPackage)

  for (const dayData of packageDay) {
        dayData.package_id = `${newId}`;
        await createPackageDay(dayData);
  }

  for (const activities of packageActivities) {
    const newActivites = {
      package_id: newId,
      day: activities.day,
      activity: activities.activity,
      activity_type: activities.activity_type,
      object_id: activities.object_id,
      description: activities.description
    }
    await createPackageActivites(newActivites)
  }
  console.log(packageService);

  for (const service of packageService) {
    const newService = {
      package_id: newId,
      service_package_id: service.service_package_id,
      status: service.status
    }
    await createPackageService(newService)
  }
  return newId
};

const listAllPackageController = async() => {
  return await listAllPackage()
}

const listAllServicePackageController = async() => {
  return await listAllServicePackage()
}

const getServiceByIdController = async(params) => {
  return await serviceById(params)
}

const postServiceController = async(params) => {
  let {lastIdNumber} = await getLatestIdService()
  let newId = lastIdNumber+1
  const idNumberString = newId.toString().padStart(2, "0");
  newId = `S${idNumberString}`
  console.log(newId, 'ini idnya');
  params.id = newId
  return await addService(params)
}

const deleteServiceController = async(params) => {
  return await deleteService(params)
}

module.exports = {
  getAllBasePackageController,
  getPackageByIdController,
  getListAllServicePackageByIdController,
  getAverageRatingPackageByIdController,
  getListPackageActivityByIdController,
  getListAllGalleryPackageByIdController,
  getListAllReviewPackageByIdController,
  getListDayPackageByIdController,
  getListAllServicePackageController,
  createExtendBookingController,
  listAllPackageController,
  listAllServicePackageController,
  getServiceByIdController,
  postServiceController,
  deleteServiceController,
}
