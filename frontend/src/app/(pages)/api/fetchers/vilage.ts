import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListVillage = async () => {
  const res = await useAxiosAuth.get('/village')
  return res.data.data
}

export const fetchUlakanVillage = async() => {
  const res = await useAxiosAuth.get('village/ulakan')
  return res.data.data
}

export const fetchEstuaryGeom = async() => {
  const res = await useAxiosAuth.get('village/estuary')
  return res.data.data
}