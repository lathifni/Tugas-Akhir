'use client'

import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { faBed, faCalendarCheck, faCartShopping, faComment, faFileCircleCheck, faHouse, faList, faListUl, faMosque, faPuzzlePiece, faSquarePollHorizontal, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavigationItemAdmin() {
  const { data: session, update, status } = useSession()
  const [subMenuPackage, setSubMenuPackage] = useState(false)
  const [subMenuObject, setSubMenuObject] = useState(false)
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
      <div className={`relative duration-500 select-none text-gray-200`} >
        <ul className="pt-6 px-3 font-medium text-lg">
          <Link href={"/explore"}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Home</span>
            </li>
          </Link>
          <Link href={'/dashboard/reservation'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Manage Reservation</span>
            </li>
          </Link>
          <Link href={'/explore/chat'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Chats</span>
            </li>
          </Link>
          <Link href={'/dashboard/users'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Manage Users</span>
            </li>
          </Link>
          <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`}
            onClick={() => setSubMenuPackage(!subMenuPackage)}
          >
            <FontAwesomeIcon icon={faSquarePollHorizontal} style={{ fontSize: '1.3em' }} />
            <span className="flex-1">Manage Package</span>
            <ChevronDown
              className={`${subMenuPackage && 'rotate-180'}`}
            />
          </li>
          {subMenuPackage && (
            <ul>
              <Link href={'/dashboard/package'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1"> 
                    <FontAwesomeIcon icon={faList} style={{ fontSize: '1.1em' }} />
                    <span className="">Data Package</span>
                  </div>
                </li>
              </Link>
              <Link href={'/dashboard/service'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1">
                    <FontAwesomeIcon icon={faPuzzlePiece} style={{ fontSize: '1.1em' }} />
                    <span className="">Service Package</span>
                  </div>
                </li>
              </Link>
            </ul>
          )}
          <Link href={'/dashboard/homestay'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faBed} />
              <span className="flex-1">Manage Homestay</span>
            </li>
          </Link>
          <Link href={'/dashboard/information'}>
            <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faFileCircleCheck} />
              <span className="flex-1">General Information</span>
            </li>
          </Link>
          <li className={`transition ease-in-out duration-500 flex rounded-md p-2 cursor-pointer hover:bg-blue-600 items-center gap-x-4 mb-2`}
            onClick={() => setSubMenuObject(!subMenuObject)}
          >
            <FontAwesomeIcon icon={faListUl} />
            <span className="flex-1">Manage Object</span>
            <ChevronDown
              className={`${subMenuObject && 'rotate-180'}`}
            />
          </li>
          {subMenuObject && (
            <ul>
              <Link href={'/dashboard/facility'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1">
                    <FontAwesomeIcon icon={faList} style={{ fontSize: '1.1em' }} />
                    <span className="">Facilty</span>
                  </div>
                </li>
              </Link>
              <Link href={'/dashboard/culinary'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1">
                    <FontAwesomeIcon icon={faUtensils} style={{ fontSize: '1.1em' }} />
                    <span className="">Culinary Places</span>
                  </div>
                </li>
              </Link>
              <Link href={'/dashboard/worship'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1">
                    <FontAwesomeIcon icon={faMosque} style={{ fontSize: '1.1em' }} />
                    <span className="">Worship Places</span>
                  </div>
                </li>
              </Link>
              <Link href={'/dashboard/souvenir'}>
                <li className="transition ease-in-out duration-500 flex rounded-md mx-8 cursor-pointer hover:bg-blue-600 items-center gap-x-4 hover:indent-2">
                  <div className="flex rounded-md p-2 cursor-pointer items-center gap-x-1">
                    <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: '1.1em' }} />
                    <span className="">Souvenir Places</span>
                  </div>
                </li>
              </Link>
            </ul>
          )}
        </ul>
      </div>
    </>
  )
}