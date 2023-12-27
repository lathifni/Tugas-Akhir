'use client'

import { IoMenu } from "react-icons/io5";

export default function NavBarLandingPage() {
  return (
    <nav className="w-full mb-16 fixed top-0 z-50 flex items-center justify-between px-4 py-2 bg-white text-blue-800 shadow-md">
      <div>
        <a href="/" className="flex gap-2">
          <img className="w-8 sm:w-10" src="/icon/logo.svg" alt="Icon" />
          <h1 className="text-xl sm:text-2xl lg:tracking-widest font-medium ">Tourism Village</h1>
        </a>
      </div>
      <div>
        <button type="button" className="block md:hidden">
          <IoMenu size={40} />
        </button>
        <div className="hidden md:block">
          <div className="flex gap-4 items-center text-sm">
            <a href="#home" className="text-blue-600 ">Home</a>
            <a href="#about" className="text-black hover:text-blue-500 ">About</a>
            <a href="#award" className="text-black hover:text-blue-500 ">Award</a>
            <a href="/login" className="ml-4 p-1 text-white rounded-sm bg-blue-500 hover:bg-green-400">Login</a>
          </div>
        </div>
      </div>
    </nav>
  )
}