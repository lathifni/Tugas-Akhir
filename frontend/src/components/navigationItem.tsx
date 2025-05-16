'use client'

import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { faBed, faBook, faCloudSun, faComments, faFilePen, faHouse, faLink, faMap, faSquarePollHorizontal, faUserPen, faWater } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from "next/navigation";

export default function NavigationItem() {
  const { data: session, update, status } = useSession()
  const [subMenuExplore, setSubMenuExplore] = useState(false  )
  const [isLoading, setIsLoading] = useState(true)
  const faInstagramIcon = faInstagram as IconProp;
  const faTiktokIcon = faTiktok as IconProp;
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session) setIsLoading(false);
      // if (session.user.google == 1 && session.user.role == 'customer' && session.user.phone == undefined) {
        
      //   // 6285274953262 nomor gilang
      //   console.log('test');
      //   router.push('/register')
      // }
      
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
      <div className={`relative duration-500 select-none text-gray-200`} >
        <ul className="pt-6 px-3 font-medium text-lg">
          {session?.user.role === 'admin' && (
            <Link href={'/dashboard'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faFilePen} style={{ fontSize: '1.3em' }} />
                <span className="flex-1">Dashboard</span>
              </li>
            </Link>
          )}
          <Link href={"/explore"}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.1em' }} />
              <span className="flex-1">Home</span>
            </li>
          </Link>
          {/* <Link href={'/explore/ulakan'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.1em' }} />
              <span className="flex-1">Explore Ulakan</span>
            </li>
          </Link> */}
          <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} 
            onClick={() => setSubMenuExplore(!subMenuExplore)}>
            <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.1em' }} />
            <span className="flex-1">Explore Village</span>
            <ChevronDown
              className={`${subMenuExplore && 'rotate-180'}`}
            />
          </li>
          {subMenuExplore && (
            <ul>
              <Link href={'/explore/our-package'}>
                <li className="transition ease-in-out duration-500 flex rounded-md ml-8 cursor-pointer hover:bg-blue-600 items-center gap-x-2 hover:indent-1">
                  <div className="flex rounded-md p-1 cursor-pointer items-center gap-x-2">
                    <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.1em' }} />
                    <span className="">Explore Our Package</span>
                  </div>
                </li>
              </Link>
              <Link href={'/explore/my-package'}>
                <li className="transition ease-in-out duration-500 flex rounded-md ml-8 cursor-pointer hover:bg-blue-600 items-center gap-x-2 hover:indent-1">
                  <div className="flex rounded-md p-1 cursor-pointer items-center gap-x-2">
                    <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.1em' }} />
                    <span className="">Explore My Package</span>
                  </div>
                </li>
              </Link>
            </ul>
          )}
          <Link href={'/explore/package'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faSquarePollHorizontal} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Tourism Package</span>
            </li>
          </Link>
          {session?.user.role === 'customer' && (
            <Link href={'/explore/reservation'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faBook} style={{ fontSize: '1.3em' }} />
                <span className="flex-1">My Reservation</span>
              </li>
            </Link>
          )}
          {/* <Link href={'/explore/homestay'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faBed} />
              <span className="flex-1">Homestay</span>
            </li>
          </Link> */}
          {session?.user.role === 'customer' && (
            <Link href={'/explore/referral'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faLink} style={{ fontSize: '1em' }} />
                <span className="flex-1">My Referral</span>
              </li>
            </Link>
          )}
          {(session?.user.role === 'customer' || session?.user.role === 'admin')  && (
            <Link href={'/explore/chat'}>
              <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
                <FontAwesomeIcon icon={faComments} style={{ fontSize: '1em' }} />
                <span className="flex-1">Chat</span>
              </li>
            </Link>
          )}
          {/* <Link href={'/explore/weather-forecast'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faCloudSun} style={{ fontSize: '1em' }} />
              <span className="flex-1">Weather Forecast</span>
            </li>
          </Link>
          <Link href={'/explore/water-info'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faWater} style={{ fontSize: '1.1em' }} />
              <span className="flex-1">Water Info</span>
            </li>
          </Link> */}
          <li className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 mb-2`} >
            <a href="https://www.instagram.com/green_talao_park/" className="flex-1" target="_blank">
              <div className="flex hover:bg-blue-600 p-2 rounded-lg justify-center">
                <FontAwesomeIcon icon={faInstagramIcon} className=""/>
                <span className="flex-1 ml-2 text-sm font-medium">Instagram</span>
              </div>
            </a>
            <a href="https://www.tiktok.com/@greentalaopark009" className="flex-1" target="_blank">
              <div className="flex hover:bg-blue-600 p-2 rounded-lg justify-center">
                <FontAwesomeIcon icon={faTiktokIcon} className=""/>
                <span className="flex-1 ml-2 text-sm font-medium">Tik Tok</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}