const { deleteGalleriesWorshipById, deleteGalleriesWorshipByUrl } = require("../services/galleries");
const { listGeomWorship, listWorshipByRadius, listAllWorship, getWorshipById, getLatestIdWorship, addWorship, getLatestIdGalleryWorship, addWorshipGallery, deleteWorshipById, putWorshipById } = require("../services/worship")

const convertCoordinatesToString = (coordinates) => {
  const coordStrings = coordinates
    .map((coordPair) => coordPair.join(" "))
    .join(",");
  return `'MULTIPOLYGON(((${coordStrings})))',0`;
};

const listGeomWorshipController = async() => {
  return await listGeomWorship()
}

const listWorshipByRadiusController = async(payload) => {
  return await listWorshipByRadius(payload)
}

const listAllWorshipController = async() => {
  return await listAllWorship()
}

const getWorshipByIdController = async(params) => {
  return await getWorshipById(params)
}

const postWorshipController = async (params) => {
  let { lastIdNumber } = await getLatestIdWorship();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `WP${idNumberString}`;
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
  await addWorship(params);

  let { lastIdNumberGallery } = await getLatestIdGalleryWorship();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.url.length; i++) {
    console.log(params.url[i]);
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GP${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      culinary_place_id: params.id,
      url: params.url[i]
    }
    await addWorshipGallery(paramsGallery)
  }
  return 1;
};

const putWorshipByIdController = async(params) => {
  let { lastIdNumberGallery } = await getLatestIdGalleryWorship();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.newUrl.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GP${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      worship_place_id: params.id,
      url: params.newUrl[i]
    }
    await addWorshipGallery(paramsGallery)
  }

  for (let i = 0; i < params.deletedUrl.length; i++) {
    const paramsGallery = { url: params.deletedUrl[i] }
    await deleteGalleriesWorshipByUrl(paramsGallery)
  }
   
  if (params.geom === null) {
    return await putWorshipById(params);
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
  await putCulinaryById(params);

  // params.deletedUrl.forEach(url => {
  //   console.log(url);
  // });
}

const deleteWorshipByIdController = async(params) => {
  await deleteGalleriesWorshipById(params)
  return await deleteWorshipById(params)
}

module.exports = { listGeomWorshipController, listWorshipByRadiusController, listAllWorshipController, getWorshipByIdController
  , postWorshipController, deleteWorshipByIdController, putWorshipByIdController,  }