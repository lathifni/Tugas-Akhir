'use client'

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { RiBuilding3Line } from "react-icons/ri";
// import { useMediaQuery } from "react-responsive";
import { IoMdHome } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import Link from "next/link";

export default function SideBar2() {
  const [isOpen, setIsOpen] = useState(false)

  const sideBarAnimation = {
    open: {
      width: '18rem',
      transition: {
        damping: 40,
      }
    },
    closed: {
      width: '4rem',
      transition: {
        damping: 40,
      }
    }
  }
  return (
    <div>
      <motion.div
        variants={sideBarAnimation}
        animate={isOpen ? "open" : "closed"}
        className="bg-white text-gray-400 shadow-xl z[999] w-[18rem] max-w-[18rem] h-screen overflow-hidden md:relative fixed">
        <div className="flex items-center gap-2.5 font-medium border-b py-3 border-slate-300  mx-3">
          <img
            src="https://img.icons8.com/color/512/firebase.png"
            width={45}
            alt=""
          />
          <span className="text-xl whitespace-pre">Fireball</span>
        </div>

        <div className="flex flex-col h-full ">
          <ul className="whitespace-pre px-2.5 text-xs py-6 flex flex-col gap-1 font-medium overflow-x-hidden">
            <li>
              <Link href='/home' className={"link"}><IoMdHome size={32} className="min-w-max"/>Home</Link>
            </li>
            <li>
              <Link href='/home' className={"link bg-blue-400"}><IoMdHome size={32} className="min-w-max"/>Home</Link>
            </li>
          </ul>
          <div className="whitespace-pre px-2.5 text-base py-6 flex flex-col gap-1 font-medium overflow-x-hidden">
            //
          </div>
        </div>

        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          animate={isOpen ? {
            x: 0, y: 0, rotate: 0
          } : {
            x: -10, y: -200, rotate: 180
          }}
          transition={{ duration: 0, }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer">
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
    </div >
  )
}
