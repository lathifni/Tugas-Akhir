import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomSouvenir = async () => {
  const res = await useAxiosAuth.get('/souvenir/geom')
  return res.data.data
}

export const fetchAllSouvenir = async() => {
  const res = await useAxiosAuth.get('/souvenir/all')
  return res.data.data
}