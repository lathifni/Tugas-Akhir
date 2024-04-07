const {
  allFacility,
  allTypeFacility,
  getLatestIdFacility,
  addFacility,
  addFacilityGallery,
  getLatestIdGalleryFacility,
  getFacilityById,
  putFacilityById,
  deleteFacilityById,
} = require("../services/facility");
const { deleteGalleriesFacilityById, deleteGalleriesFacilityByUrl } = require("../services/galleries");

const convertCoordinatesToString = (coordinates) => {
  const coordStrings = coordinates
    .map((coordPair) => coordPair.join(" "))
    .join(",");
  return `'MULTIPOLYGON(((${coordStrings})))',0`;
};

const getAllFacilityController = async () => {
  return await allFacility();
};

const getAllTypeFacilityController = async () => {
  return await allTypeFacility();
};

const postFacilityController = async (params) => {
  let { lastIdNumber } = await getLatestIdFacility();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `FC${idNumberString}`;
  params.id = id;

  const coordinates = [];

  const data = params.geom.coordinates;
  console.log(params.geom.coordinates);
  data.forEach((subArray) => {
    subArray.forEach((coordPair) => {
      coordinates.push(coordPair);
    });
  });
  const newGeom = convertCoordinatesToString(coordinates);

  params.geom = newGeom;
  await addFacility(params);

  let { lastIdNumberGallery } = await getLatestIdGalleryFacility();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.url.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GF${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      facility_id: params.id,
      url: params.url[i]
    }
    await addFacilityGallery(paramsGallery)
  }

  return 1;
};

const getFacilityByIdController = async(params) => {
  return await getFacilityById(params)
}

const putFacilityByIdController = async(params) => {
  console.log(params);
  let { lastIdNumberGallery } = await getLatestIdGalleryFacility();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.newUrl.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GF${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      facility_id: params.id,
      url: params.newUrl[i]
    }
    await addFacilityGallery(paramsGallery)
  }

  for (let i = 0; i < params.deletedUrl.length; i++) {
    const paramsGallery = { url: params.deletedUrl[i] }
    await deleteGalleriesFacilityByUrl(paramsGallery)
  }
   
  if (params.geom === null) {
    return await putFacilityById(params);
  }
  const coordinates = [];

  const data = params.geom.coordinates;
  data.forEach((subArray) => {
    subArray.forEach((coordPair) => {
      coordinates.push(coordPair);
    });
  });
  const newGeom = convertCoordinatesToString(coordinates);

  params.geom = newGeom;
  await putFacilityById(params);

  // params.deletedUrl.forEach(url => {
  //   console.log(url);
  // });
}

const deleteFacilityByIdController = async(params) => {
  await deleteGalleriesFacilityById(params)
  return await deleteFacilityById(params)
}

module.exports = {
  getAllFacilityController,
  getAllTypeFacilityController,
  postFacilityController,
  getFacilityByIdController,
  putFacilityByIdController,
  deleteFacilityByIdController,
};
