import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL = `${backendUrl}`;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true
});

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true
});