const { listGeomCulinary, listCulinaryByRadius, listAllCulinary, getCulinaryById, getLatestIdCulinary, addCulinary, getLatestIdGalleryCulinary, addCulinaryGallery, putCulinaryById, deleteCulinaryById } = require("../services/culinary");
const { deleteGalleriesCulinaryByUrl, deleteGalleriesCulinaryById } = require("../services/galleries");

const convertCoordinatesToString = (coordinates) => {
  const coordStrings = coordinates
    .map((coordPair) => coordPair.join(" "))
    .join(",");
  return `'MULTIPOLYGON(((${coordStrings})))',0`;
};

const listGeomCulinaryController = async() => {
  return await listGeomCulinary()
}

const listCulinaryByRadiusController = async(payload) => {
  return await listCulinaryByRadius(payload)
}

const postCulinaryController = async (params) => {
  let { lastIdNumber } = await getLatestIdCulinary();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `CP${idNumberString}`;
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
  await addCulinary(params);

  let { lastIdNumberGallery } = await getLatestIdGalleryCulinary();
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
    await addCulinaryGallery(paramsGallery)
  }
  return 1;
};

const putCulinaryByIdController = async(params) => {
  let { lastIdNumberGallery } = await getLatestIdGalleryCulinary();
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
    await addCulinaryGallery(paramsGallery)
  }

  for (let i = 0; i < params.deletedUrl.length; i++) {
    const paramsGallery = { url: params.deletedUrl[i] }
    await deleteGalleriesCulinaryByUrl(paramsGallery)
  }
   
  if (params.geom === null) {
    return await putCulinaryById(params);
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

const deleteCulinaryByIdController = async(params) => {
  await deleteGalleriesCulinaryById(params)
  return await deleteCulinaryById(params)
}

const listAllCulinaryController = async() => {
  return await listAllCulinary()
}

const getCulinaryByIdController = async(params) => {
  return await getCulinaryById(params)
}

module.exports = { listGeomCulinaryController, listCulinaryByRadiusController, postCulinaryController, putCulinaryByIdController
  , listAllCulinaryController, getCulinaryByIdController, deleteCulinaryByIdController,  }