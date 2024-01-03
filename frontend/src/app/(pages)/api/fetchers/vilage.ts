import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListVillage = async () => {
  const res = await useAxiosAuth.get('/village')
  return res.data.data
}