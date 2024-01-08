import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faBed, faBridgeWater, faBullhorn, faFish, faHouse, faMap, faMosque, faMusic, faShip, faSquarePollHorizontal, faStar, faUniversalAccess, faWater } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavigationItem() {
  const [subMenuOpenUniqueAttractions, setSubMenuOpenUniqueAttractions] = useState(false);
  const [subMenuOpenOrdinaryAttractions, setSubMenuOpenOrdinaryAttractions] = useState(false);

  return (
    <>
      <div className={`relative duration-500 select-none text-slate-700`} >
        <ul className="pt-6 px-3 font-medium text-base">
          <Link href={"/explore"}>
            <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Home</span>
            </li>
          </Link>
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '1.3em' }} />
            <span className="flex-1">Unique Atractions</span>
            <ChevronDown
              onClick={() => setSubMenuOpenUniqueAttractions(!subMenuOpenUniqueAttractions)}
              className={`${subMenuOpenUniqueAttractions && 'rotate-180'}`}
            />
          </li>
          {subMenuOpenUniqueAttractions && (
            <ul>
              <Link href={'/explore/estuary'}>
                <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                    <FontAwesomeIcon icon={faShip} style={{ fontSize: '1.3em' }} />
                    <h1 className="">Estuary</h1>
                  </div>
                </li>
              </Link>
              <Link href={'/explore/tracking'}>
                <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                    <FontAwesomeIcon icon={faBridgeWater} style={{ fontSize: '1.3em' }} />
                    <h1>Tracking Mangrove</h1>
                  </div>
                </li>
              </Link>
              <Link href={'/explore/trip'}>
                <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                    <FontAwesomeIcon icon={faFish} style={{ fontSize: '1.3em' }} />
                    <h1>Trip Pieh Island</h1>
                  </div>
                </li>
              </Link>
              <Link href={'/explore/makam'}>
                <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                    <FontAwesomeIcon icon={faMosque} style={{ fontSize: '1.3em' }} />
                    <h1>Makan Syeikh Burhanuddin</h1>
                  </div>
                </li>
              </Link>
            </ul>
          )}
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
            <FontAwesomeIcon icon={faUniversalAccess} style={{ fontSize: '1.3em' }} />
            <span className="flex-1">Ordinary Attractions</span>
            <ChevronDown
              onClick={() => setSubMenuOpenOrdinaryAttractions(!subMenuOpenOrdinaryAttractions)}
              className={`${subMenuOpenOrdinaryAttractions && 'rotate-180'}`}
            />
          </li>
          {subMenuOpenOrdinaryAttractions && (
            <ul>
              <Link href={'/explore/water'}>
              <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <FontAwesomeIcon icon={faWater} style={{ fontSize: '1.3em' }} />
                  <h1>Water Attraction</h1>
                </div>
              </li>
              </Link>
              <Link href={'/explore/culture'}>
              <li className="flex rounded-md mx-8 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                <div className="flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4">
                  <FontAwesomeIcon icon={faMusic} style={{ fontSize: '1.3em' }} />
                  <h1>Culture Attraction</h1>
                </div>
              </li>
              </Link>
            </ul>
          )}
          <Link href={"/explore/event"} >
            <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Event</span>
            </li>
          </Link>
          <Link href={'/explore/tourism'}>
            <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faSquarePollHorizontal} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Tourism Package</span>
            </li>
          </Link>
          <Link href={'/explore/homestay'}>
            <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faBed} />
              <span className="flex-1">Homestay</span>
              {/* tambah untuk admin nanti yaaaaa..... */}
            </li>
          </Link>
          <Link href={'/explore/ulakan'}>
            <li className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-200 items-center gap-x-4 mb-2`} >
              <FontAwesomeIcon icon={faMap} style={{ fontSize: '1.3em' }} />
              <span className="flex-1">Explore Ulakan</span>
            </li>
          </Link>
          {/* tambah dashboard nanti yaaaa..... */}
          <li className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 mb-2`} >
            <a href="https://www.instagram.com/green_talao_park/" className="flex-1" target="_blank">
              <div className="flex hover:bg-slate-300 p-2 rounded-lg justify-center">
                <img className="w-4" src="/icon/instagram.svg" alt="IconInstagram" />
                <h1 className="pl-2 text-sm font-medium ">Instagram</h1>
              </div>
            </a>
            <a href="https://www.tiktok.com/@greentalaopark009" className="flex-1" target="_blank">
              <div className="flex hover:bg-slate-300 p-2 rounded-lg justify-center">
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