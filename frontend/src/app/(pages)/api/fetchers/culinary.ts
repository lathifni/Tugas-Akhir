import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomCulinary = async () => {
  const res = await useAxiosAuth.get('/culinary/geom')
  return res.data.data
}

export const fetchListCulinaryByRadius = async (payload: any) => {
  const res = await useAxiosAuth.get('/culinary/listByRadius', {
    params: payload, 
  })
  return res.data.data
}