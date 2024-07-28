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
         checks: ['none'],
      }),
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            emailOrUsername: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            const res = await fetch('http://localhost:3000/auth/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  emailOrUsername: credentials?.emailOrUsername,
                  password: credentials?.password,
               }),
            });
            const loginResponse = await res.json();

            if (loginResponse.status == 'failed') return null
            
            return loginResponse;
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user, account, profile }) {
         if (account?.provider == 'google' && profile) {
            const requestLogin = await fetch(
               // 'https://8lcx6qm9-3000.asse.devtunnels.ms/oauth2/google/frontend',
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
               { refreshToken: responseDataLogin.refreshToken },
               { user_image: responseDataLogin.user_image },
               { role: responseDataLogin.role },
               { user_id: responseDataLogin.user_id }
            );
         }
         return { ...token, ...user};
      },
      // async signIn({ profile, account, user }) {
      //    console.log('ni user di sign in', user);
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
      //       // account = Object.assign({}, account, { accessToken: 'test'}, { refreshToken: 'testlagi' })
      //    }
         
      //    return true;
      // },
      async session({ session, token }) {
         session.user = token as any;
         return session;
      },
   },
};
