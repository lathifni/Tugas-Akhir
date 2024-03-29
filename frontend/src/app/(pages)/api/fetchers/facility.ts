import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchAllFacility = async() => {
  const res = await useAxiosAuth.get('/facility/all')
  return res.data.data
}