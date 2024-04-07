import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchAllFacility = async() => {
  const res = await useAxiosAuth.get('/facility/all')
  return res.data.data
}

export const fetchAllTypeFacility = async() => {
  const res = await useAxiosAuth.get('/facility/allType')
  return res.data.data
}

export const fetchFacilityById = async(params: any) => {
  const res = await useAxiosAuth.get(`/facility/${params}`)
  return res.data.data
}