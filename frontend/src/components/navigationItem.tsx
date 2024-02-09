'use client'

import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { faBed, faBook, faBridgeWater, faBullhorn, faFish, faHouse, faList, faMap, faSquarePollHorizontal, faStar, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavigationItem() {
  const [subMenuOpenUniqueAttractions, setSubMenuOpenUniqueAttractions] = useState(false);
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
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`relative duration-500 select-none text-slate-700`} >
        <ul className="pt-6 px-3 font-medium text-base">
          {session?.user.role === 'admin' && (
            <Link href={'/explore/dashboard'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faUserPen} style={{ fontSize: '1.3em' }} />
              </li>
              <span className="flex-1">Dashboard</span>
            </Link>
          )}
          <Link href={"/explore"}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Home</span>
            </li>
          </Link>
          <Link href={'/explore/ulakan'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Explore Ulakan</span>
            </li>
          </Link>
          {session?.user.role === 'customer' && (
            <Link href={'/explore/reservation'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faBook} style={{ fontSize: '1.3em' }} />
                <span className="flex-1">Reservation</span>
              </li>
            </Link>
          )}
          <Link href={'/explore/package'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faSquarePollHorizontal} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Tourism Package</span>
            </li>
          </Link>
          <Link href={'/explore/homestay'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faBed} />
              <span className="flex-1">Homestay</span>
            </li>
          </Link>
          <li className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 mb-2`} >
            <a href="https://www.instagram.com/green_talao_park/" className="flex-1" target="_blank">
              <div className="transition ease-in-out duration-500 flex hover:bg-slate-300 p-2 rounded-lg justify-center">
                <img className="w-4" src="/icon/instagram.svg" alt="IconInstagram" />
                <h1 className="pl-2 text-sm font-medium ">Instagram</h1>
              </div>
            </a>
            <a href="https://www.tiktok.com/@greentalaopark009" className="flex-1" target="_blank">
              <div className="transition ease-in-out duration-500 flex hover:bg-slate-300 p-2 rounded-lg justify-center">
                <img className="w-4 " src="/icon/tiktok.svg" alt="IconTikTok" />
                <h1 className="pl-2 text-sm font-medium ">Tik Tok</h1>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}