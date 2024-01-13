import { faI, faRoad } from "@fortawesome/free-solid-svg-icons";
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
}

interface MapContentSouvenirPlacesProps {
  name: string;
  address: string;
  contact_person: string;
}

interface MapContentHomestayPlacesProps {
  name: string;
  address: string;
  contact_person: string;
}


export const MapContentCulinaryPlaces: React.FC<MapContentCulinaryPlacesProps> = ({ name, address, contact_person, lat, lng, onRouteClick }) => {
  const routeClickHandler = () => {
    console.log('ini dibagian handler mapHelper');
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

export const MapContentWorshipPlaces: React.FC<MapContentWorshipPlacesProps> = ({ name, address, capacity}) => {
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><User className="mr-2"/>{capacity}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}

export const MapContentSouvenirPlaces: React.FC<MapContentSouvenirPlacesProps> = ({ name, address, contact_person}) => {
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2"/>{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}

export const MapContentHomestayPlaces: React.FC<MapContentHomestayPlacesProps> = ({ name, address, contact_person}) => {
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2"/>{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2"/>{contact_person}</p>
      <div className="flex justify-center text-lg">
        <div role="button" title="route" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500"/></div>
      </div>
    </div>
  )
}