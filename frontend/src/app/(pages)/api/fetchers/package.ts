import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListAllBasePackage = async() => {
  const res = await useAxiosAuth.get('/package/listAllBasePackage')
  return res.data.data
}