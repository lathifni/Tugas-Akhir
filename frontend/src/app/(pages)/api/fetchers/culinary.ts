import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomCulinary = async () => {
  const res = await useAxiosAuth.get('/culinary/geom')
  return res.data.data
}

export const fetchListCulinaryByRadius = async (lat: number, lng: number, radius: number) => {
  const res = await useAxiosAuth.get( `/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
  return res.data.data
}