import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListEvent = async () => {
  const res = await useAxiosAuth.get('/event')
  return res.data.data
}