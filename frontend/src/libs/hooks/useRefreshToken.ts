"use client";

import axios from "../axios";
import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();
  // console.log('di hooks refreshtoken', session?.user.refreshToken);

  const refreshToken = async () => {
    
    const res = await axios.post("/auth/token", 
    {refreshToken: session?.user.refreshToken}
    );
    // console.log(' ini respond minta refresh token ', res);

    if (session) session.user.accessToken = res.data.accessToken;
    else signIn();
  };
  return refreshToken;
};