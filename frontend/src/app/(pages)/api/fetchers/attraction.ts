import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomAttractions = async() => {
  const res = await useAxiosAuth.get('/attraction/geom')
  return res.data.data
}

export const fetchGeomEstuary = async () => {
  const res = await useAxiosAuth.get('/attraction/estuary')
  return res.data.data
}
export const fetchGeomTracking = async () => {
  const res = await useAxiosAuth.get('/attraction/tracking')
  return res.data.data
}
export const fetchGeomTrip = async () => {
  const res = await useAxiosAuth.get('/attraction/trip')
  return res.data.data
}

export const fetchGeomMakam = async () => {
  const res = await useAxiosAuth.get('/attraction/makam')
  return res.data.data
}

export const fetchListGeomWater = async () => {
  const res = await useAxiosAuth.get('/attraction/water')
  return res.data.data
}
export const fetchListGeomCulture = async () => {
  const res = await useAxiosAuth.get('/attraction/culture')
  return res.data.data
}