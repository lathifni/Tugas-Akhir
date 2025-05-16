const promisePool = require("../../config/database")

const getInfo = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gtp`)
  return rows[0]
}

const addGtpGallery = async(params) => {
  const sql = "INSERT INTO gallery_gtp (id, gtp_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.gtp_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const deleteGtpGallery = async(params) => {
  const sql = "DELETE FROM gallery_gtp WHERE url=?";
  const values = [params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const updateGtp = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE gtp SET name=?, type_of_tourism=?, address=?, open=?, close=?, ticket_price=?, contact_person=?,
    description=? WHERE id=?`, 
    [params.name, params.type_of_tourism, params.address, params.open, params.close, params.ticket_price, params.contact_person
      ,params.description, 'GTP01'
    ]
  );
  return rows;
}

const getGeom = async() => {
  const [rows] = await promisePool.query(`SELECT ST_AsGeoJSON(geom) AS geom FROM gtp`)
  return rows
}

const getAllObjectLama = async() => {
  // const [rows] = await promisePool.query(`
  // SELECT id, name, category, 'E' AS type, price FROM event UNION SELECT id, name, 'shopping not include' as category, 'CP' AS type, 0 AS price FROM culinary_place UNION 
  // SELECT id, name, 'shopping not include' as category, 'WP' AS type, 0 AS price FROM worship_place UNION SELECT id, name, category, 'A' AS type, price FROM attraction UNION 
  // SELECT id,name,'shopping not include' as category, 'SP' AS type, 0 AS price FROM souvenir_place UNION SELECT id,name,category, 'FC' AS type, price FROM facility`)
  const [rows] = await promisePool.query(`
    SELECT id,name,category,type,price,COALESCE(lat, NULL) AS lat,COALESCE(lng, NULL) AS lng
    FROM (
    SELECT id, name, category, 'E' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM event
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'CP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM culinary_place
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'WP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM worship_place
    
    UNION 
    SELECT id, name, category, 'A' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM attraction
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'SP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM souvenir_place
    
    UNION  
    SELECT id, name, category, 'FC' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng
    FROM facility
) AS combined_data;`)
  return rows
}

const getAllObject = async() => {
  // const [rows] = await promisePool.query(`
  // SELECT id, name, category, 'E' AS type, price FROM event UNION SELECT id, name, 'shopping not include' as category, 'CP' AS type, 0 AS price FROM culinary_place UNION 
  // SELECT id, name, 'shopping not include' as category, 'WP' AS type, 0 AS price FROM worship_place UNION SELECT id, name, category, 'A' AS type, price FROM attraction UNION 
  // SELECT id,name,'shopping not include' as category, 'SP' AS type, 0 AS price FROM souvenir_place UNION SELECT id,name,category, 'FC' AS type, price FROM facility`)
  const [rows] = await promisePool.query(`
    SELECT id, name, category, type, price, COALESCE(lat, NULL) AS lat, COALESCE(lng, NULL) AS lng, 
       COALESCE(type_attr, NULL) AS type_attr, COALESCE(address, NULL) AS address, COALESCE(contact_person, NULL) AS contact_person, 
       COALESCE(capacity, NULL) AS capacity, COALESCE(geom, NULL) as geom
    FROM (
    SELECT id, name, category, 'E' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           type AS type_attr, NULL AS address, NULL AS contact_person, NULL AS capacity
    FROM event
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'CP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           NULL AS type_attr, address, contact_person, NULL AS capacity
    FROM culinary_place
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'WP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           NULL AS type_attr, address, NULL AS contact_person, capacity
    FROM worship_place
    
    UNION 
    SELECT id, name, category, 'A' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           type AS type_attr, NULL AS address, NULL AS contact_person, NULL AS capacity
    FROM attraction

    UNION
    SELECT id, name, 'shopping not include' AS category, 'HO' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           NULL AS type_attr, address, contact_person, NULL AS capacity
    FROM homestay
    
    UNION 
    SELECT id, name, 'shopping not include' AS category, 'SP' AS type, 0 AS price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           NULL AS type_attr, address, contact_person, NULL AS capacity
    FROM souvenir_place
    
    UNION  
    SELECT id, name, category, 'FC' AS type, price, 
           ST_Y(ST_Centroid(geom)) AS lat, 
           ST_X(ST_Centroid(geom)) AS lng,
           ST_AsGeoJSON(geom) AS geom,
           NULL AS type_attr, NULL AS address, NULL AS contact_person, NULL AS capacity
    FROM facility
    ) AS combined_data;`
  )
  return rows
}

const getFacilty = async() => {
  
}

const totalAdmin = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(U.id) total_admin FROM users U JOIN ROLE R ON R.id=U.role_id WHERE U.role_id=1;`)
  return rows[0]
}

const totalCustomer = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(U.id) total_customer FROM users U JOIN ROLE R ON R.id=U.role_id WHERE U.role_id=2;`)
  return rows[0]
}

const totalBasePackage = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(P.id) total_base_package FROM package P WHERE P.custom=0;`)
  return rows[0]
}

const totalCostumPackage = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(P.id) total_custom_package FROM package P WHERE P.custom=1;`)
  return rows[0]
}

const totalWorshipPlace = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(WP.id) total_worship_place FROM worship_place WP;`)
  return rows[0]
}

const totalCulinaryPlace = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(CP.id) total_culinary_place FROM culinary_place CP;`)
  return rows[0]
}

const totalSouvenirPlace = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(SP.id) total_souvenir_place FROM souvenir_place SP;`)
  return rows[0]
}

const totalHomestay = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(H.id) total_homestay FROM homestay H;`)
  return rows[0]
}

const totalUnitHomestay = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(UH.unit_number) total_unit_homestay FROM unit_homestay UH;`)
  return rows[0]
}

const totalMaxOccupancyHomestay = async() => {
  const [rows] = await promisePool.query(
    `SELECT SUM(UH.capacity) total_max_occupancy_homestay FROM unit_homestay UH;`)
  return rows[0]
}

const totalEvent = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(E.id) total_event FROM event E;`)
  return rows[0]
}

const totalAttraction = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(A.id) total_attraction FROM attraction A;`)
  return rows[0]
}

const totalFacility = async() => {
  const [rows] = await promisePool.query(
    `SELECT COUNT(F.id) total_facility FROM facility F;`)
  return rows[0]
}

const revenue = async() => {
  const [rows] = await promisePool.query(
    `SELECT DATE_FORMAT(check_in, '%b %Y') AS month_year, SUM(total_price) AS total_revenue FROM reservation 
    WHERE check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY month_year ORDER BY MIN(check_in);`)
  return rows
}

const packageAnalysis = async() => {
  const [rows] = await promisePool.query(
    `SELECT DATE_FORMAT(check_in, '%b %Y') AS month_year,
    COUNT(CASE WHEN custom = 0 THEN 1 END) AS total_existing_package,
    COUNT(CASE WHEN custom = 1 THEN 1 END) AS total_custom_package FROM 
    reservation JOIN package P ON P.id=reservation.package_id WHERE check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY month_year ORDER BY MIN(check_in);`)
  return rows
}

const dayAnalysis = async() => {
  const [rows] = await promisePool.query(
    `SELECT p.max_day AS total_days, COUNT(r.id) AS total_reservations FROM reservation r JOIN 
    (SELECT package_id, MAX(day) AS max_day FROM package_day GROUP BY package_id) p ON r.package_id = p.package_id 
    WHERE r.check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY p.max_day ORDER BY p.max_day;`)
  return rows
}

const peopleAnalysis = async() => {
  const [rows] = await promisePool.query(
    `SELECT DATE_FORMAT(check_in, '%b %Y') AS month_year, SUM(total_people) AS total_people FROM 
    reservation JOIN package P ON P.id=reservation.package_id WHERE check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) 
    GROUP BY month_year ORDER BY MIN(check_in);`)
  return rows
}

const referralAnalysis = async() => {
  const [rows] = await promisePool.query(
    `SELECT DATE_FORMAT(check_in, '%b %Y') AS month_year, COUNT(R.id) AS total_reservations, 
    FORMAT(SUM(r.total_price * u.percentage_referral / 100), 2) AS total_referral_value FROM reservation R 
    JOIN users u ON R.owner_referral_id = u.id WHERE check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY month_year 
    ORDER BY MIN(check_in);`)
  return rows
}

const allAnnouncement = async() => {
  const [rows] = await promisePool.query(
    `SELECT * FROM announcement`)
  return rows
}

const allActiveAnnouncement = async() => {
  const [rows] = await promisePool.query(
    `SELECT * FROM announcement WHERE status=1`)
  return rows
}

const getLatestIdAnnouncement = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM announcement`)
  return rows[0]
}

const newAnnouncement = async(params) => {
  const sql = "INSERT INTO announcement (id, id_gtp, description, status) VALUES (?, ?, ?, ?)";
  const values = [params.id, params.gtp_id, params.description, params.status];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const updateAnnouncement = async(params) => {
  console.log(params);
  
  const [rows] = await promisePool.query(
    `UPDATE announcement 
     SET description = ?, status = ? WHERE id = ?`,
    [params.description, params.status, params.id]
  );
  return rows.affectedRows;
}

const deleteAnnouncementById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM announcement WHERE id ='${params.id}'`)
  return rows.affectedRows
}

const dataGalleryGTP = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gallery_gtp WHERE gtp_id='GTP01'`)
  return rows
}

const dataInformation = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gtp WHERE id='GTP01'`)
  return rows[0]
}

module.exports = { 
  getInfo, getGeom, getAllObject, totalAdmin, totalCustomer, totalBasePackage, totalCostumPackage
  , totalWorshipPlace, totalCulinaryPlace, totalSouvenirPlace, totalHomestay, totalUnitHomestay
  , totalMaxOccupancyHomestay, totalEvent, totalFacility, totalAttraction, revenue, packageAnalysis
  , dayAnalysis, peopleAnalysis, referralAnalysis, allAnnouncement, getLatestIdAnnouncement
  , newAnnouncement, deleteAnnouncementById, updateAnnouncement, allActiveAnnouncement
  , dataInformation, dataGalleryGTP, addGtpGallery, updateGtp, deleteGtpGallery, 
}