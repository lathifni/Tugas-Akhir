const moment = require('moment');

const { listGeomHomestay, listHomestayByRadius, listAllHomestay, availableHomestay, bookedHomestay, getHomestayById, getLatestIdHomestay, getLatestIdGalleryHomestay, addHomestay, addHomestayGallery, deleteHomestayById, getListAllGalleryHomestayById, getListAllHomestayFacilityById, getListAllHomestayUnitById, addFacilityHomestayById, getLatestIdFacilityHomestay, createNewFacilityHomestay, getLatestIdFacilityHomestayUnit, createNewFacilityHomestayUnit, addFacilityUnitById, addUnit, getLatestIdGalleryUnit, getLatestIdUnit, addGalleryUnit, deleteUnitHomestay, getListAllGalleryUnitType, updateUnit, deleteGalleryUnit, addGalleryHomestay, deleteGalleryHomestay, updateHomestay, allReviewHomestayById, deleteFacilityUnitDetailHomestay, deleteUnitHomestayById } = require("../services/homestay.js");
const { deleteGalleriesHomestayById, deleteGalleriesUnit, deleteGalleriesUnitHomestayById } = require('../services/galleries.js');

const convertCoordinatesToString = (coordinates) => {
  const coordStrings = coordinates
    .map((coordPair) => coordPair.join(" "))
    .join(",");
  return `'MULTIPOLYGON(((${coordStrings})))',0`;
};

const listGeomHomestayController = async() => {
  return await listGeomHomestay()
}

const listHomestayByRadiusController = async(payload) => {
  return await listHomestayByRadius(payload)
}

const listAllHomestayController = async() => {
  return await listAllHomestay()
}

const availableHomestayController = async(params) => {
  let { checkin_date, max_day } = params
  checkin_date = moment(checkin_date).utc().format('YYYY-MM-DD')
  let checkout_date = checkin_date
  if (max_day > 2) checkout_date = moment(checkin_date).utc().add(max_day-2).format('YYYY-MM-DD')
  return await availableHomestay({ checkin_date, checkout_date })
}

const bookedHomestayController = async(params) => {
  return await bookedHomestay(params)
}

const getHomestayByIdController = async(params) => {
  const homestay = await getHomestayById(params)
  const gallery = await getListAllGalleryHomestayById(params)
  const facility = await getListAllHomestayFacilityById(params)
  const unit = await getListAllHomestayUnitById(params)
  const review = await allReviewControllerById(params)
  const galleryUnit = await getListAllGalleryUnitType(params)  
  
  const units = [];
  unit.forEach(row => {
    // Cari unit yang sudah ada di dalam array units
    let unit = units.find(u => u.unit_number === row.unit_number);
    
    // Jika belum ada, tambahkan unit baru
    if (!unit) {
      unit = {
        unit_number: row.unit_number,
        unit_name: row.nama_unit,
        price: row.price,
        capacity: row.capacity,
        avg_rating: row.avg_rating,
        facilities: [],  // Inisialisasi array facilities
        review: [],
        gallery:[],
      };
      units.push(unit);
    }
    
    // Tambahkan fasilitas ke unit yang sesuai
    unit.facilities.push({
      name: row.name,
      description: row.description
    });
  });

  review.forEach(row => {
    let unit = units.find(u => u.unit_number === row.unit_number);
    unit.review.push({
      review: row.review,
      username_or_fullname: row.username_or_fullname,
      rating: row.rating
    })
  })

  galleryUnit.forEach(row => {
    let unit = units.find(u => u.unit_number === row.unit_number);
    unit.gallery.push({
      id: row.id,
      url: row.url,
    })
  })

  return {
    homestay,
    gallery,
    facility,
    units,
  }
}

const createNewHomestayController = async(params) => {
  console.log(params);
  let { lastIdNumber } = await getLatestIdHomestay();
  let newId = lastIdNumber + 1;
  const idNumberString = newId.toString().padStart(3, "0");
  id = `HO${idNumberString}`;
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
  await addHomestay(params);

  let { lastIdNumberGallery } = await getLatestIdGalleryHomestay();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.url.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GH${idGalleryNumberString}`;
    const paramsGallery = {
      id: newId,
      homestay_id: params.id,
      url: params.url[i]
    }
    await addHomestayGallery(paramsGallery)
  }
  return 1;
}

const deleteHomestayByIdController = async(params) => {
  await deleteGalleriesHomestayById(params)
  await deleteGalleriesUnitHomestayById(params)
  await deleteUnitHomestayById(params)
  return deleteHomestayById(params)
}

const allUnitHomestayByIdController = async(params) => {
  const unit = await getListAllHomestayUnitById(params)  
  const gallery = await getListAllGalleryUnitType(params)
  
  const units = [];
  unit.forEach(row => {
    // Cari unit yang sudah ada di dalam array units
    let unit = units.find(u => u.unit_number === row.unit_number);
    
    // Jika belum ada, tambahkan unit baru
    if (!unit) {
      unit = {
        unit_number: row.unit_number,
        unit_name: row.nama_unit,
        price: row.price,
        unit_type: row.unit_type,
        capacity: row.capacity,
        description: row.description,
        facilities: [],  // Inisialisasi array facilities
        galleries: [] 
      };
      units.push(unit);
    }
    
    // Tambahkan fasilitas ke unit yang sesuai
    unit.facilities.push({
      id: row.id,
      name: row.name,
      description: row.fud_description
    });
  });
  gallery.forEach(row => {
    let unit = units.find(u => u.unit_number === row.unit_number && u.unit_type === row.unit_type);
    if (unit) {
      unit.galleries.push({
        id: row.id,
        url: row.url
      });
    }
  });

  return {
    units,
  }
}

const addFacilityHomestayByIdController = async(params) => {
  if (params.id_facility && params.description && params.id) {
    await addFacilityHomestayById(params)
    return ;

  }
  return;
}

const createFacilityHomestayController = async(params) => {
  const { lastIdNumberGallery } = await getLatestIdFacilityHomestay()
  let newId = lastIdNumberGallery + 1;
  const idNumberString = newId.toString().padStart(2, "0");
  id = `FH${idNumberString}`;
  params.id = id;
  console.log(params);
  await createNewFacilityHomestay(params)
  return params
}

const createFacilityHomestayUnitController = async(params) => {
  const { lastIdNumberGallery } = await getLatestIdFacilityHomestayUnit()
  let newId = lastIdNumberGallery + 1;
  const idNumberString = newId.toString().padStart(2, "0");
  id = `FU${idNumberString}`;
  params.id = id;
  console.log(params);
  await createNewFacilityHomestayUnit(params)
  return params
}

const addFacilityUnitByIdController = async(params) => {
  return await addFacilityUnitById(params)  
}

const addUnitController = async(params) => {
  const data = await getLatestIdUnit()
  let latestUnitNumber = data.latestUnitNumber+1
  const unit_number = String(latestUnitNumber).padStart(2, '0');
  params.unit_number = unit_number

  await addUnit(params)
  
  let { lastIdNumberGallery } = await getLatestIdGalleryUnit();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;

  for (let i = 0; i < params.gallery.length; i++) {
    newIdGallery = newIdGallery + 1;
    idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
    newId = `GU${idGalleryNumberString}`;
    const paramsGallery = {
      homestay_id: params.homestay_id,
      unit_type: params.type_unit,
      unit_number: params.unit_number,
      id: newId,
      url: params.gallery[i]
    }
    await addGalleryUnit(paramsGallery)
  }
  return console.log(params);
}

const deleteFacilityUnitController = async(params) => {  
  await deleteGalleriesUnit(params)
  await deleteFacilityUnitDetailHomestay(params)
  return await deleteUnitHomestay(params)
}

const updateHomestayController = async(params) => {
  if (params.gallery) {
    let { lastIdNumberGallery } = await getLatestIdGalleryHomestay();
    let newIdGallery, idGalleryNumberString;
    newIdGallery = lastIdNumberGallery;
    for (const gallery of params.gallery) {
      newIdGallery = newIdGallery + 1;
      idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
      newId = `GH${idGalleryNumberString}`;
      const data = {
        url: gallery,
        id: newId,
        homestay_id: params.homestay_id
      }
      await addGalleryHomestay(data)
    }
  }

  if (params.delete_gallery) {
    for (const delete_gallery of params.delete_gallery ) {
      const data = {
        url: delete_gallery,
        homestay_id: params.homestay_id,
      }
      await deleteGalleryHomestay(data)
    }
  }

  return await updateHomestay(params)
}

const editUnitController = async(params) => {
  for (const delete_gallery of params.delete_gallery ) {
    const data = {
      url: delete_gallery,
      homestay_id: params.homestay_id,
      unit_number: params.unit_number
    }    
    await deleteGalleryUnit(data)
  }

  let { lastIdNumberGallery } = await getLatestIdGalleryUnit();
  let newIdGallery, idGalleryNumberString;
  newIdGallery = lastIdNumberGallery;
  if (params.urlGallery) {
    for (const url_gallery of params.urlGallery) {
      newIdGallery = newIdGallery + 1;
      idGalleryNumberString = newIdGallery.toString().padStart(3, "0");
      newId = `GU${idGalleryNumberString}`;
      const paramsGallery = {
        homestay_id: params.homestay_id,
        unit_type: params.type_unit,
        unit_number: params.unit_number,
        id: newId,
        url: url_gallery
      }
      await addGalleryUnit(paramsGallery)
    }
  }
  return await updateUnit(params);
}

const allReviewControllerById = async(params) => {  
  return await allReviewHomestayById(params)
}
 
module.exports = { listGeomHomestayController, listHomestayByRadiusController, listAllHomestayController
  , availableHomestayController, bookedHomestayController, getHomestayByIdController, createNewHomestayController
  , deleteHomestayByIdController, allUnitHomestayByIdController, addFacilityHomestayByIdController
  , createFacilityHomestayController, createFacilityHomestayUnitController, addFacilityUnitByIdController
  , addUnitController, deleteFacilityUnitController, editUnitController, updateHomestayController
  , allReviewControllerById
 }