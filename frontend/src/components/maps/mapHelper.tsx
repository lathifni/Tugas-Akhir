import { faI, faRoad, faSpa } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contact, Pin, User } from "lucide-react";

interface MapContentCulinaryPlacesProps {
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject:number, lngObject:number) => void;
}

interface MapContentWorshipPlacesProps {
  name: string;
  address: string;
  capacity: number;
  lat: number;
  lng: number;
  onRouteClick: (latObject:number, lngObject:number) => void;
}

interface MapContentSouvenirPlacesProps {
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject:number, lngObject:number) => void;
}

interface MapContentHomestayPlacesProps {
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject:number, lngObject:number) => void;
}


export const MapContentCulinaryPlaces: React.FC<MapContentCulinaryPlacesProps> = ({ name, address, contact_person, lat, lng, onRouteClick }) => {
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2"/>{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  );
};

export const MapContentWorshipPlaces: React.FC<MapContentWorshipPlacesProps> = ({ name, address, capacity, lat, lng, onRouteClick }) => {
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><User className="mr-2"/>{capacity}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}

export const MapContentSouvenirPlaces: React.FC<MapContentSouvenirPlacesProps> = ({ name, address, contact_person, lat, lng, onRouteClick }) => {
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2"/>{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}

export const MapContentHomestayPlaces: React.FC<MapContentHomestayPlacesProps> = ({ name, address, contact_person, lat, lng, onRouteClick }) => {
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2"/>{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}

export const GtpInfoWindow = () => {
  return (
    <div className="p-1">
      <h1 className="font-bold text-center text-lg">Green Talao Park</h1>
      <p className="flex justify-center m-1"><FontAwesomeIcon icon={faSpa} className="mr-2"/> Tourism Village</p>
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