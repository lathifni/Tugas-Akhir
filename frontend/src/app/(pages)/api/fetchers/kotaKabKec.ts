import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomKotaKab = async () => {
  const res = await useAxiosAuth.get('/kotaKabKec/kotaKab')
  return res.data.data
}

export const fetchListGeomKec = async () => {
  const res = await useAxiosAuth.get('/kotaKabKec/kec')
  return res.data.data
}