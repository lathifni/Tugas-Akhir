const { deleteGalleriesSouvenirByUrl, deleteGalleriesSouvenirById } = require("../services/galleries");
const { listGeomSouvenir, listSouvenirByRadius, listAllSouvenir, getLatestIdSouvenir, addSouvenir, getLatestIdGallerySouvenir, addSouvenirGallery, putSouvenirById, getSouvenirById, deleteSouvenirById } = require("../services/souvenir")

const convertCoordinatesToString = (coordinates) => {
  const coordStrings = coordinates
    .map((coordPair) => coordPair.join(" "))
    .join(",");
  return `'MULTIPOLYGON(((${coordStrings})))',0`;
};

const postSouvenirController = async (params) => {
  let { lastIdNumber } = await getLatestIdSouvenir();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `SP${idNumberString}`;
  params.id = id;

  const coordinates = [];

  const data = params.geom.coordinates;
  data.forEach((subArray) => {
    subArray.forEach((coordPair) => {
      coordinates.push(coordPair);
    });
  });
  const newGeom = convertCoordinatesToString(coordinates);

  params.geom = newGeom;
  await addSouvenir(params);

  let { lastIdNumberGallery } = await getLatestIdGallerySouvenir();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.url.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GP${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      souvenir_place_id: params.id,
      url: params.url[i]
    }
    await addSouvenirGallery(paramsGallery)
  }
  return 1;
};

const putSouvenirByIdController = async(params) => {
  let { lastIdNumberGallery } = await getLatestIdGallerySouvenir();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.newUrl.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GP${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      facility_id: params.id,
      url: params.newUrl[i]
    }
    await addSouvenirGallery(paramsGallery)
  }

  for (let i = 0; i < params.deletedUrl.length; i++) {
    const paramsGallery = { url: params.deletedUrl[i] }
    await deleteGalleriesSouvenirByUrl(paramsGallery)
  }
   
  if (params.geom === null) {
    return await putSouvenirById(params);
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
  await putSouvenirById(params);

  // params.deletedUrl.forEach(url => {
  //   console.log(url);
  // });
}

const listGeomSouvenirController = async() => {
  return await listGeomSouvenir()
}

const listSouvenirByRadiusController = async(payload) => {
  return await listSouvenirByRadius(payload)
}

const listAllSouvenirController = async() => {
  return await listAllSouvenir()
}

const getSouvenirByIdController = async(params) => {
  return await getSouvenirById(params)
}

const deleteSouvenirByIdController = async(params) => {
  await deleteGalleriesSouvenirById(params)
  return await deleteSouvenirById(params)
}

module.exports = { postSouvenirController, putSouvenirByIdController,  listGeomSouvenirController, listSouvenirByRadiusController
  , listAllSouvenirController, getSouvenirByIdController, deleteSouvenirByIdController,  }