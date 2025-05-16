'use client'

import { useState } from 'react';
import Form from './form';
import { MenuSquare } from 'lucide-react';

export default function LoginPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="w-full mb-16 fixed top-0 z-50 flex items-center justify-between px-4 py-2 bg-white text-blue-800 shadow-md">
        <div>
          <a href="/" className="flex gap-2">
            <img className="w-8 sm:w-14" src="/icon/logo.svg" alt="Icon" />
            <h1 className="text-xl sm:text-4xl lg:tracking-widest font-medium ">Tourism Village</h1>
          </a>
        </div>
        <div>
          <button type="button" className="block md:hidden" onClick={toggleMenu}>
            <MenuSquare className="text-blue-500" size={40} />
          </button>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row gap-4 items-center text-lg">
              <a href="#home" className="text-blue-600 ">Home</a>
              <a href="#about" className="text-black hover:text-blue-500 ">Explore</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center h-screen bg-blue-600">
        <Form />
      </div>
    </>
  );
}