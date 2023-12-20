import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
   pages: {
      signIn: '/login'
   },
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
         authorization: {
            params: {
               prompt: 'consent',
               access_type: 'offline',
               response_type: 'code',
            },
         },
      }),
      CredentialsProvider({
         name: 'Credentials',
         credentials: {},
         async authorize(credentials) {
            const { emailOrUsername, password } = credentials as { emailOrUsername: string; password: string}
            const res = await fetch('http://localhost:3000/auth/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  emailOrUsername: emailOrUsername,
                  password: password,
               }),
            });

            const user = await res.json();

            if (user.status == 'success') {
               console.log(user);
               return user;
            } else {
               console.log(user);
               return null;
            }
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user, account, profile }) {
         if (account?.provider == 'google' && profile) {
            const requestLogin = await fetch(
               'http://localhost:3000/oauth2/google/frontend',
               {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     profile
                  }),
               }
            );
            const responseDataLogin = await requestLogin.json()
            
            token = Object.assign(
               {},
               token,
               { accessToken: responseDataLogin.accessToken },
               { refreshToken: responseDataLogin.refreshToken }
            );
         }
         return { ...token, ...user};
      },
      // async signIn({ profile }) {
      //    if (profile !== undefined) {
      //       try {
      //          const res = await fetch(
      //             'http://localhost:3000/oauth2/google/frontend',
      //             {
      //                method: 'POST',
      //                headers: { 'Content-Type': 'application/json' },
      //                body: JSON.stringify({
      //                   profile
      //                }),
      //             }
      //          );
      //       } catch (error) {
      //          console.log(error);
      //       }
      //    }
      //    return true;
      // },
      async session({ session, token }) {
         session.user = token as any;
         return session;
      },
   },
};
