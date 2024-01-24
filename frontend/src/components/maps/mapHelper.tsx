import { faCompass, faI, faMagnifyingGlass, faMoneyBill1Wave, faRoad, faSpa } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contact, Pin, User } from "lucide-react";

interface MapContentCulinaryPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapContentWorshipPlacesProps {
  id: string;
  name: string;
  address: string;
  capacity: number;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapContentSouvenirPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapContentHomestayPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapEventContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface MapWaterContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
}

export const MapContentCulinaryPlaces: React.FC<MapContentCulinaryPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick }) => {
  const addressHref = `/explore/culinary/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div>
    </div>
  );
};

export const MapContentWorshipPlaces: React.FC<MapContentWorshipPlacesProps> = ({ id, name, address, capacity, lat, lng, onRouteClick }) => {
  const addressHref = `/explore/worship/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><User className="mr-2" />{capacity}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div>
    </div>
  )
}

export const MapContentSouvenirPlaces: React.FC<MapContentSouvenirPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick }) => {
  const addressHref = `/explore/worship/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div>
    </div>
  )
}

export const MapContentHomestayPlaces: React.FC<MapContentHomestayPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick }) => {
  const addressHref = `/explore/homestay/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div>
    </div>
  )
}

export const GtpInfoWindow = () => {
  return (
    <div className="p-1">
      <h1 className="font-bold text-center text-lg">Green Talao Park</h1>
      <p className="flex justify-center m-1"><FontAwesomeIcon icon={faSpa} className="mr-2" /> Tourism Village</p>
    </div>
  )
}

export const Legend = () => {
  return (
    <div className="text-xs flex flex-col">
      <div className="flex items-center">
        <img src="/icon/bathroom.png" alt="" className="w-4 h-5 mr-2" /><p>Public Bathroom</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/selfie.png" alt="" className="w-4 h-5 mr-2" /><p>Selfie Area</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/souvenir.png" alt="" className="w-4 h-5 mr-2" /><p>Souvenir Place</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/treehouse.png" alt="" className="w-4 h-5 mr-2" /><p>Tree House</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/tower.png" alt="" className="w-4 h-5 mr-2" /><p>Viewing Tower</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/worship.png" alt="" className="w-4 h-5 mr-2" /><p>Worship Place</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/negara.png" alt="" className="w-4 h-4 mr-2" /><p>Negara</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/provinsi.png" alt="" className="w-4 h-4 mr-2" /><p>Provinsi</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/kabkota.png" alt="" className="w-4 h-4 mr-2" /><p>Kota/Kabupaten</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/kecamatan.png" alt="" className="w-4 h-4 mr-2" /><p>Kecamatan</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/nagari.png" alt="" className="w-4 h-4 mr-2" /><p>Nagari</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/desawisata.png" alt="" className="w-4 h-4 mr-2" /><p>Desa Wista</p>
      </div>
    </div>
  )
}

export const MapContentEvent: React.FC<MapEventContentProps> = ({ id, name, type, price }) => {
  const addressHref = `/explore/event/${id}`
  return (
    <div className="p-1">
      <p className="text-lg font-semibold p-1">{name}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faSpa} className="mr-1" /> {type}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-1" />{price}</p>
      <div className="text-center mt-2 border-solid border-2 p-2 m-1 border-blue-500 rounded-lg ">
        <a href={addressHref} title="Info" target="_blank"> <FontAwesomeIcon icon={faMagnifyingGlass} className="text-blue-500 text-base" />Info Detail</a>
      </div>
    </div>
  )
}

export const MapContentWater: React.FC<MapWaterContentProps> = ({ id, name, type, price }) => {
  const addressHref = `/explore/attraction/${id}`
  return (
    <div className="p-1">
      <p className="text-lg font-semibold p-1 text-center">{name}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faSpa} className="mr-1" /> {type}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-1" />{price}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faCompass} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"> <FontAwesomeIcon icon={faMagnifyingGlass} className="text-blue-500 text-base" /></a>
      </div>
    </div>
  )
}