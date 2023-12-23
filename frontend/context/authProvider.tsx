"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth'
import React, { ReactNode } from "react";

interface AuthContextProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider