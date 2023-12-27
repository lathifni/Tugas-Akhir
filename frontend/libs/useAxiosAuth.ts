import axios from "axios";
import { getSession } from "next-auth/react";

const BASE_URL = "http://localhost:3000";

const useAxiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const setupInterceptors = async () => {
  const session = await getSession();

  useAxiosAuth.interceptors.request.use(
    (config) => {
      if (session?.user?.accessToken && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useAxiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        
        if (!prevRequest?.sent) {
          prevRequest.sent = true;
          if (session?.user?.refreshToken) {
            const res = await useAxiosAuth.post("/auth/token", { refreshToken: session.user.refreshToken });
            if (session) session.user.accessToken = res.data.accessToken;
          } else {
            console.error("Refresh token is not available");
          }
          if (session?.user?.accessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
          }
          return useAxiosAuth(prevRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors();

export default useAxiosAuth;
