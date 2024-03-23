import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchGetMessages = async(params:any) => {
  const res = await useAxiosAuth.get(`/messages/${params}`)
  return res.data.data
}

export const fetchSendMessage = async(params: any) => {
  const res = await useAxiosAuth.post('/messages', params)
  return res.data.data
}