'use client'

import Avatar from '@mui/material/Avatar'
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useEffect, useState } from 'react'
import { MoonLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'

export default function NavigationHeader() {
  const { data: session, update, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();
  
  useEffect(() => {
  // Set isLoading berdasarkan status NextAuth
  if (status === 'loading') {
    setIsLoading(true);
  } else {
    setIsLoading(false);
    // Logika redirect hanya jika status sudah tidak loading
    if (status === 'authenticated' && session) {
      if (session.user.google === 1 && session.user.role === 'customer' && (session.user.phone === undefined || session.user.phone === null)) {
        console.log('Redirecting to /register due to missing phone number for Google user.');
        router.push('/register');
      }
    }
  }
}, [status, session, router]); // Tambahkan router ke dependency array jika digunakan di dalamnya

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl lg:tracking-widest font-medium">Village Tourism</h1>
      <br />
      <MoonLoader color="#36d7b7" speedMultiplier={3} size={75} />
      <p className='mt-4 text-lg'>Loading ...</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <motion.div className=''>
        <a href="/" className="flex gap-2">
          <img className="w-9" src="/icon/logoWhite.svg" alt="Icon" />
          <h1 className="text-2xl lg:tracking-widest font-medium ">Village Tourism</h1>
        </a>
      </motion.div>
      <motion.div
        className='mt-4'
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{
          scale: 0.8,
          rotate: -15,
          borderRadius: "100%"
        }}
      >
        <Avatar  alt={session?.user.name} src={session ? `${session?.user.user_image}` : 'photos/talao.png'} sx={{ width: 100, height: 100 }}/>
        {/* <img src={`${session?.user.user_image}`} alt="" /> */}
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        className='text-lg mt-4'
      >
        <p>Hello, {session ? session?.user.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Visitor'}</p>
      </motion.div>
    </div>
  )
}