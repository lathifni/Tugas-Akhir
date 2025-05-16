import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      status: string;
      id: string;
      user_id: number;
      user_image: string;
      email: string;
      accessToken: string;
      google: number;
      name: string;
      user_image: string;
      refreshToken: string;
      role: string;
      phone: string;
    } & DefaultSession["user"];
    token: {
      email: string;
      name: string;
      picture: string;
      refreshToken: string;
    }
  }
}