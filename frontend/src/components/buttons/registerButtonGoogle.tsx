"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RegisterInButtonGoogle() {
  return (
    <a href={`${backendUrl}/oauth2/google/login`}>
      <button className="flex items-center gap-4 shadow-xl rounded-lg pl-3">
        <Image src="/google-logo.png" height={30} width={30} alt={""} />
        <span className="bg-blue-500 text-white px-4 py-3">
          Sign up with Google
        </span>
      </button>
    </a>
  );
}