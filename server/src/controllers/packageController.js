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
  createNewPackage,
  getLatestIdGalleryPackage,
  addPackageGallery,
  getInformationPackageInById,
  getInformationPackageDayInById,
  updatePackageInformation,
  updatePackageDay,
  deleteActivitiesBeforeUpdate,
  updatePackageActivites,
  updatePackageService,
  deletePackageDayById,
  deleteDetailPackageById,
  deleteDetailServicePackageById,
  deleteGalleryPackageById,
  deletePackageById,
  exploreOurPackage,
  allActivityById,
  exploreMyPackage,
  exploreBrowsePackage,
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

const getAllPackageActivityByIdController = async (params) => {
  const packages = await allActivityById(params);
  const result = {};
  
  packages.forEach(pkg => {
    // Jika paket belum ada di result, tambahkan entry baru
    if (!result[pkg.id]) {
      result[pkg.id] = {
        id: pkg.id,
        name: pkg.name,
        cover_url: pkg.cover_url,
        days: []
      };
    }

    let dayEntry = result[pkg.id].days.find(day => day.day === pkg.day);
      if (!dayEntry) {
        dayEntry = { day: pkg.day, activities: [] };
        result[pkg.id].days.push(dayEntry);
      }

      dayEntry.activities.push({
        activity: parseInt(pkg.activity, 10), // Menggunakan `order` sebagai nomor urut aktivitas
        type: pkg.activity_type, // Tipe aktivitas
        object_id: pkg.object_id // ID aktivitas
      });
    });

  return Object.values(result)

  // return await getPackageActivityById(params);
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
  params.id = newId
  return await addService(params)
}

const deleteServiceController = async(params) => {
  return await deleteService(params)
}

const createNewPackageController = async(params) => {  
  const { package_day, package_activities, package_service, gallery} = params
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
    name: params.package_name,
    type_id: params.package_type,
    min_capacity: params.min_capacity,
    price: params.price,
    contact_person: params.contact_person,
    description: params.description,
    custom: 0,
    cover_url: params.cover[0],
    video_url: params.video[0],
  }
  await createNewPackage(newPackage)

  for (const dayData of package_day) {
    dayData.package_id = `${newId}`;
    await createPackageDay(dayData);
  }

  for (const activities of package_activities) {
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

  for (const service of package_service) {
  const newService = {
    package_id: newId,
    service_package_id: service.service_package_id,
    status: service.status
  }
  await createPackageService(newService)
  }

  let { lastIdNumberGallery } = await getLatestIdGalleryPackage();
  console.log(lastIdNumberGallery);
  
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;
  for (let i = 0; i < gallery.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    idGalleryNumberString = `GP${idGalleryNumberString}`;
    const paramsGallery = {
      id: idGalleryNumberString,
      package_id: newId,
      url: gallery[i]
    }    
    await addPackageGallery(paramsGallery)
  }
}

const allPackageInformationByIdController = async(params) => {
  const package = await getInformationPackageInById(params)
  const package_day = await getInformationPackageDayInById(params)
  const package_service = await getListAllServicePackageById(params)
  const package_activities = await getPackageActivityById(params)
  const package_gallery = await getListAllGalleryPackageById(params)

  return {
    package: package,
    package_day: package_day,
    package_service: package_service,
    package_activities: package_activities,
    package_gallery: package_gallery,
  };
}

const updatePackageInformationController = async(params) => {  
  const { package_day, package_activities, package_service, gallery} = params
  const data = ({
    id: params.id,
    name: params.package_name,
    type_id: params.package_type,
    min_capacity: params.min_capacity,
    price: params.price,
    contact_person: params.contact_person,
    description: params.description,
    video_url: params.video?.[0] ?? undefined, // Pakai nilai pertama atau undefined
    cover_url: params.cover?.[0] ?? undefined 
  })
  await updatePackageInformation(data)

  await deleteActivitiesBeforeUpdate(params.id)  
  
  for (const dayData of package_day) {
    dayData.package_id = `${params.id}`;
    await updatePackageDay(dayData);
  }

  for (const activities of package_activities) {
    const newActivites = {
      package_id: params.id,
      day: activities.day,
      activity: activities.activity,
      activity_type: activities.activity_type,
      object_id: activities.object_id,
      description: activities.description
    }
    await updatePackageActivites(newActivites)
  }

  for (const service of package_service) {
    const newService = {
      package_id: params.id,
      service_package_id: service.service_package_id,
      status: service.status
    }  
    await updatePackageService(newService)
  }
  return ;
}

const deletePackageByIdController = async(params) => {
  await deletePackageDayById(params)
  await deleteDetailPackageById(params)
  await deleteDetailServicePackageById(params)
  await deleteGalleryPackageById(params)
  await deletePackageById(params)
  return console.log(params);
}

const exploreOurPackageController = async() => {
  const packages = await exploreOurPackage();
  const result = {};

  packages.forEach(pkg => {
    // Jika paket belum ada di result, tambahkan entry baru
    if (!result[pkg.id]) {
      result[pkg.id] = {
        id: pkg.id,
        name: pkg.name,
        cover_url: pkg.cover_url,
        days: []
      };
    }

    let dayEntry = result[pkg.id].days.find(day => day.day === pkg.day);
      if (!dayEntry) {
        dayEntry = { day: pkg.day, activities: [] };
        result[pkg.id].days.push(dayEntry);
      }

      dayEntry.activities.push({
        activity: parseInt(pkg.activity, 10), // Menggunakan `order` sebagai nomor urut aktivitas
        type: pkg.activity_type, // Tipe aktivitas
        object_id: pkg.object_id, // ID aktivitas
        description: pkg.description
      });
    });

  return Object.values(result)
}

const exploreBrowsePackageController = async(params) => {
  const packages = await exploreBrowsePackage(params);
  const result = {};

  packages.forEach(pkg => {
    // Jika paket belum ada di result, tambahkan entry baru
    if (!result[pkg.id]) {
      result[pkg.id] = {
        id: pkg.id,
        name: pkg.name,
        cover_url: pkg.cover_url,
        days: []
      };
    }

    let dayEntry = result[pkg.id].days.find(day => day.day === pkg.day);
      if (!dayEntry) {
        dayEntry = { day: pkg.day, activities: [] };
        result[pkg.id].days.push(dayEntry);
      }

      dayEntry.activities.push({
        activity: parseInt(pkg.activity, 10), // Menggunakan `order` sebagai nomor urut aktivitas
        type: pkg.activity_type, // Tipe aktivitas
        object_id: pkg.object_id, // ID aktivitas
        description: pkg.description
      });
    });

  return Object.values(result)
}

const exploreMyPackageController = async(params) => {
  const packages = await exploreMyPackage(params);
  const result = {};

  packages.forEach(pkg => {
    // Jika paket belum ada di result, tambahkan entry baru
    if (!result[pkg.id]) {
      result[pkg.id] = {
        id: pkg.id,
        name: pkg.name,
        cover_url: pkg.cover_url,
        days: []
      };
    }

    let dayEntry = result[pkg.id].days.find(day => day.day === pkg.day);
      if (!dayEntry) {
        dayEntry = { day: pkg.day, activities: [] };
        result[pkg.id].days.push(dayEntry);
      }

      dayEntry.activities.push({
        activity: parseInt(pkg.activity, 10), // Menggunakan `order` sebagai nomor urut aktivitas
        type: pkg.activity_type, // Tipe aktivitas
        object_id: pkg.object_id // ID aktivitas
      });
    });

  return Object.values(result)
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
  createNewPackageController,
  allPackageInformationByIdController,
  updatePackageInformationController,
  deletePackageByIdController,
  exploreOurPackageController, 
  getAllPackageActivityByIdController,
  exploreMyPackageController,
  exploreBrowsePackageController, 
}
