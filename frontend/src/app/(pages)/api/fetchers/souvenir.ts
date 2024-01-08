import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomSouvenir = async () => {
  const res = await useAxiosAuth.get('/souvenir/geom')
  return res.data.data
}