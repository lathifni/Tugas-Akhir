'use client'

import Avatar from '@mui/material/Avatar'
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useEffect, useState } from 'react'

export default function NavigationHeader() {
  const { data: session, update, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      if (session) {
        setIsLoading(false);
      }
    }
  }, [update, status, session])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div className=''>
        <a href="/" className="flex gap-2">
          <img className="w-8" src="/icon/logo.svg" alt="Icon" />
          <h1 className="text-base lg:tracking-widest font-medium ">Green Talao Park</h1>
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
        <Avatar alt='test' src={session ? `${session?.user.user_image}` : 'photos/talao.png'} sx={{ width: 100, height: 100 }} />
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