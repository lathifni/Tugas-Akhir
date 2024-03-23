import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchUserChats = async(params: any) => {
  const res = await useAxiosAuth.get(`/chat/${params}`)
  return res.data.data
}