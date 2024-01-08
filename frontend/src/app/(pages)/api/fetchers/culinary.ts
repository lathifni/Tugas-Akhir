import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomCulinary = async () => {
  const res = await useAxiosAuth.get('/culinary/geom')
  return res.data.data
}