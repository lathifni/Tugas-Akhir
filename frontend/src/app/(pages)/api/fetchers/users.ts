import useAxiosAuth from "../../../../../libs/useAxiosAuth";

interface User {
  id: number;
  email: string;
  username: string;
  fullname: string | null;
}

export const fetchUsers = async () => {
  const response= await useAxiosAuth.get('/users') 
  return response.data.data
};

export const fetchCart = async () => {
  console.log("Fetching Cart");
  const response = await useAxiosAuth.get("http://localhost:3000/cart");
  const cart = response.data;

  console.log("Cart: ", cart);
  return cart;
};