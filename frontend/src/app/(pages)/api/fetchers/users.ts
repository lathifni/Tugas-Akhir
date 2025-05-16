import useAxiosAuth from "../../../../../libs/useAxiosAuth";

interface User {
  id: number;
  email: string;
  username: string;
  fullname: string | null;
}

export const fetchAllCostumer = async () => {
  const response = await useAxiosAuth.get('/users/allcostumer') 
  return response.data.data
};

export const fetchAllAdmin = async() => {
  const response = await useAxiosAuth.get('/users/alladmin') 
  return response.data.data
};

export const fetchDetailUser = async(id:number) => {
  const response = await useAxiosAuth.get(`/users/detail/${id}`) 
  return response.data.data
}
