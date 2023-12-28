import { BarChart, Bookmark, Calendar, ChevronDown, Files, Home, HomeIcon, Inbox, LayoutDashboard, LayoutDashboardIcon, LogOut, MessageCircleCodeIcon, ServerIcon, Settings, User } from "lucide-react";
import { useState } from "react";
import { faBed, faBridgeWater, faBullhorn, faFish, faHouse, faMap, faMosque, faMusic, faShip, faSquare, faSquarePollHorizontal, faStar, faUniversalAccess, faWater } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function NavigationItem() {
  const subMenuAction = () => {
    return;
  }

  const [open, setOpen] = useState(true);
  const [subMenuOpenUniqueAttractions, setSubMenuOpenUniqueAttractions] = useState(false);
  const [subMenuOpenOrdinaryAttractions, setSubMenuOpenOrdinaryAttractions] = useState(false);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div>
      {/* <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600">
          <HomeIcon />
          <span className="text-[15px] ml-4 text-slate-600">Home</span>
        </div>
        <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600">
          <Bookmark />
          <span className="text-[15px] ml-4 text-slate-600">Bookmark</span>
        </div>
        <hr className="my-4 text-gray-600" />
        <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600">
         <MessageCircleCodeIcon />
          <span className="text-[15px] ml-4 text-slate-600">Messages</span>
        </div>

        <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center" onClick={subMenuAction}>
            <span className="text-[15px] ml-4 text-slate-600">Chatbox</span>
            <span className="text-sm rotate-180" id="arrow">
              <ChevronDown />
            </span>
          </div>
        </div>
        <div className=" leading-7 text-left text-sm font-thin mt-2 w-4/5 mx-auto" id="submenu">
          <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Social</h1>
          <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Personal</h1>
          <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Friends</h1>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600">
          <i className="bi bi-box-arrow-in-right"></i>
          <span className="text-[15px] ml-4 text-slate-600">Logout</span>
        </div> */}
      <div className={` bg-teal-800 relative duration-500`} >
        <div className=" justify-center mt-3">
          <h1
            className={`text-white  font-medium text-2xl text-center duration-200 ${!open && 'invisible'
              }`}
          >
            LOGO
          </h1>
        </div>
        <ul className="pt-6">
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faHouse} />
            <span className="flex-1">Home</span>
          </li>
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 transition-all ease-in-out duration-300`} >
            <FontAwesomeIcon icon={faStar} />
            <span className="flex-1">Unique Atractions</span>
            <ChevronDown
              onClick={() => setSubMenuOpenUniqueAttractions(!subMenuOpenUniqueAttractions)}
              className={`${subMenuOpenUniqueAttractions && 'rotate-180'}`} 
            />
          </li>
          { subMenuOpenUniqueAttractions && (
          <ul>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faShip} />
              <h1>Estuary</h1>
            </li>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faBridgeWater} />
              <h1>Tracking Mangrove</h1>
            </li>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faFish} />
              <h1>Trip Pieh Island</h1>
            </li>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faMosque} />
              <h1>Makan Syeikh Burhanuddin</h1>
            </li>
          </ul>
          )}
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faUniversalAccess} />
            <span className="flex-1">Ordinary Attractions</span>
            <ChevronDown
              onClick={() => setSubMenuOpenOrdinaryAttractions(!subMenuOpenOrdinaryAttractions)}
              className={`${subMenuOpenOrdinaryAttractions && 'rotate-180'}`} 
            />
          </li>
          { subMenuOpenOrdinaryAttractions && (
          <ul>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faWater} />
              <h1>Water Attraction</h1>
            </li>
            <li className="flex px-5 cursor-pointer text-center text-sm text-gray-200 py-1">
              <FontAwesomeIcon icon={faMusic} />
              <h1>Culture Attraction</h1>
            </li>
          </ul>
          )}
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faBullhorn} />
            <span className="flex-1">Event</span>
          </li>
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faSquarePollHorizontal} />
            <span className="flex-1">Tourism Package</span>
          </li>
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faBed} />
            <span className="flex-1">Homestay</span>
          {/* tambah untuk admin nanti yaaaaa..... */}
          </li>
          <li className={`flex rounded-md p-2 cursor-pointer hover:bg-teal-400 text-white text-sm items-center gap-x-4 `} >
            <FontAwesomeIcon icon={faMap} />
            <span className="flex-1">Explore Ulakan</span>
          </li>
          {/* tambah dashboard nanti yaaaa..... */}
        </ul>
      </div>
    </div>
  )
}