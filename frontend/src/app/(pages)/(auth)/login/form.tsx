'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Form() {
   const [emailOrUsername, setEmailOrUsername] = useState('');
   const [password, setPassword] = useState('');
   const [errorLogin, setErrorLogin] = useState('')

   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const loginData = {
            emailOrUsername: emailOrUsername,
            password: password,
            redirect: false,
         };
         const res = await signIn('credentials', loginData)
         if (res?.error) {
            setErrorLogin('Invalid Email/Username or Password');
         } else {
            //  router.replace('https://8lcx6qm9-3001.asse.devtunnels.ms/explore');
             router.replace('/explore');
          }
      } catch (error: any) {
         setErrorLogin(error)
      }
   };

   const handleSignInGoogle = () => {
      signIn('google', {
         // callbackUrl: 'https://8lcx6qm9-3001.asse.devtunnels.ms/explore'
         callbackUrl: '/explore'
      })
   }

   return (
      <>
         <section className="flex flex-col md:flex-row h-screen items-center">
            <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
               <img
                  src="https://www.kabaribukota.id/wp-content/uploads/2023/12/22818.jpg"
                  alt=""
                  className="w-full h-full object-cover"
               />
            </div>

            <div
               className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center"
            >
               <div className="w-full h-100">
                  <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 text-center">
                     Log in to your account
                  </h1>
                  <form className="mt-6 text" onSubmit={handleSubmit}>
                  { errorLogin? ( 
                     <div>
                        <h1 className='text-red-600 text-center'>{ errorLogin }</h1>
                     </div>
                  ): null}
                     <div>
                        <label className="block text-gray-700">
                           Email or Username
                        </label>
                        <input
                           value={emailOrUsername}
                           onChange={(e) => setEmailOrUsername(e.target.value)}
                           type="string"
                           name="emailOrUsername"
                           id="emailOrUsername"
                           placeholder="Enter Email Address or Username"
                           className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                           autoFocus
                           autoComplete="true"
                           required
                        />
                     </div>

                     <div className="mt-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           type="password"
                           name="password"
                           id="password"
                           placeholder="Enter Password"
                           minLength={8}
                           className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                           required
                        />
                     </div>

                     <button
                        type="submit"
                        className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                     >
                        Log In
                     </button>
                  </form>

                  <hr className="my-6 border-gray-300 w-full" />

                  <button
                  onClick={handleSignInGoogle}
                     type="button" 
                     className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
                  >
                     <div className="flex items-center justify-center">
                        <img 
                      src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png" // Gantikan dengan path atau URL gambar Google Anda
                      alt="Google Logo"
                      className="w-6 h-6"
                    />    
                    {/* <Image src={'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png'}  alt="Google Logo" className="w-6 h-6"/> */}
                        <span className="ml-4">Log in with Google</span>
                     </div>
                  </button>

                  <p className="mt-8 text-center">
                     Need an account?{' '}
                     <a
                        href="register"
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                     >
                        Create an account
                     </a>
                  </p>
               </div>
            </div>
         </section>
      </>
   );
}
