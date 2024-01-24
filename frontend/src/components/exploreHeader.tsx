'use client'

import Avatar from '@mui/material/Avatar'
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useEffect, useState } from 'react'

export default function ExploreHeader() {
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status, update } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const avatarButtonHandler = () => {
    console.log('test');
    
    setDropdownOpen((prev) => !prev)
  }

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
  }, [])

  return (
    <div className="flex mt-1 sm:mt-3 md:mt-5 justify-between z-[99999]">
      <div className="flex items-center">
        <p className='text-3xl font-bold text-slate-800 ml-10'>Green Talao Park</p>
      </div>
      {!isLoading && (
        <div className='relative '>
          {session && (
            <div className='w-12 h-12 rounded-lg bg-white mr-1 sm:mr-3 md:mr-5 flex items-center justify-center' role='button'
              onClick={avatarButtonHandler}
              // onMouseLeave={() => { if (dropdownOpen) setDropdownOpen(false)} }
            >
              <Avatar className='justify-center text-center' />
            </div>
          )}
          {!session && (
            <div className='w-20 h-12 rounded-lg mr-5 flex items-center justify-center'>
              <a href="/login" className="p-1 text-white rounded-sm bg-blue-500 hover:bg-green-400">Login</a>
            </div>
          )}
          {dropdownOpen && (
            <div className="absolute mt-1 right-5 bg-white border rounded shadow-lg w-28 z-50" onMouseLeave={() => setDropdownOpen(false)}>
              <a href="">
                <button className="block w-full py-2 px-4 text-left hover:bg-gray-200">My Profile</button>
              </a>
              <a href="/logout">
                <button className="block w-full py-2 px-4 text-left hover:bg-gray-600">Logout</button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}