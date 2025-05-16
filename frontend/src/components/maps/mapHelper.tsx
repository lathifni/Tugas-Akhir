import { faCompass, faI, faMagnifyingGlass, faMapLocationDot, faMoneyBill1Wave, faRoad, faSpa } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contact, Pin, User } from "lucide-react";

interface MapContentGeneralProps {
  id: string;
  icon: string|null;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  contact_person: string | null;
  capacity: string | null;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapContentCulinaryPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapContentBrowseCulinaryPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onBrowseRespond: (id:string, name:string) => void;
  browse: boolean | false;
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

interface MapContentBrowseWorshipPlacesProps {
  id: string;
  name: string;
  address: string;
  capacity: number;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onBrowseRespond: (id:string, name:string) => void;
  browse: boolean | false;
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

interface MapContentBrowseSouvenirPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onBrowseRespond: (id:string, name:string) => void;
  browse: boolean | false;
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

interface MapContentBrowseHomestayPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onBrowseRespond: (id:string, name:string) => void;
  browse: boolean | false;
}

interface MapEventContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
  lat:number;
  lng:number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

interface MapWaterContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface MapAttractionContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
  explore: number
  lat:number;
  lng:number;
  onRouteClick: (latObject: number, lngObject: number) => void;
}

export const MapContentGeneral: React.FC<MapContentGeneralProps> = ({id,name,icon,address,contact_person,capacity,lat,lng,onRouteClick}) => {
   const addressHref = `/explore/${icon}/${id}`
   const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      {address && (
        <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      )}
      {contact_person && (
        <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      )}
      {capacity && (
        <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{capacity}</p>
      )}
      <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        {(icon && icon != 'event') && (
          <a href={addressHref} title="Info" target="_blank" >
            <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
          </a>
        )}
      </div>
    </div>
  )
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

export const MapContentBrowseCulinaryPlaces: React.FC<MapContentBrowseCulinaryPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, browse, onBrowseRespond }) => {
  const addressHref = `/explore/culinary/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  const browseRespondHandler = () => {
    onBrowseRespond(id, name)
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
        {browse && (
        <div role="button" title="route" onClick={() => browseRespondHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg">Browse Place</div>
        )}
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

export const MapContentBrowseWorshipPlaces: React.FC<MapContentBrowseWorshipPlacesProps> = ({ id, name, address, capacity, lat, lng, onRouteClick, browse, onBrowseRespond }) => {
  const addressHref = `/explore/worship/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  const browseRespondHandler = () => {
    onBrowseRespond(id, name)
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
        {browse && (
        <div role="button" title="route" onClick={() => browseRespondHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg">Browse Place</div>
        )}
      </div>
    </div>
  )
}

export const MapContentSouvenirPlaces: React.FC<MapContentSouvenirPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick }) => {
  const addressHref = `/explore/souvenir/${id}`
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

export const MapContentBrowseSouvenirPlaces: React.FC<MapContentBrowseSouvenirPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, browse, onBrowseRespond }) => {
  const addressHref = `/explore/souvenir/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  const browseRespondHandler = () => {
    onBrowseRespond(id, name)
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
        {browse && (
        <div role="button" title="route" onClick={() => browseRespondHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg">Browse Place</div>
        )}
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

export const MapContentBrowseHomestayPlaces: React.FC<MapContentBrowseHomestayPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, browse, onBrowseRespond }) => {
  const addressHref = `/explore/homestay/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  const browseRespondHandler = () => {
    onBrowseRespond(id, name)
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
        {browse && (
        <div role="button" title="route" onClick={() => browseRespondHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg">Browse Place</div>
        )}
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

export const MapContentEvent: React.FC<MapEventContentProps> = ({ id, name, lat, lng, type, price, onRouteClick }) => {
  const addressHref = `/explore/event/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
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

export const MapContentAttraction: React.FC<MapAttractionContentProps> = ({ id, name, lat, lng, type, price, explore, onRouteClick }) => {
  if (explore == 0) {
    const addressHref = `/explore/attractions/${id}`
    const routeClickHandler = () => {
      onRouteClick(lat, lng)
    }
    return (
      <div className="p-1">
        <p className="text-lg font-semibold p-1 text-center">{name}</p>
        <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faSpa} className="mr-1" /> {type}</p>
        <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-1" />Rp{price}</p>
        {/* <div className="text-center mt-2 border-solid border-2 p-2 m-1 border-blue-500 rounded-lg ">
          <a href={addressHref} title="Info" target="_blank"> <FontAwesomeIcon icon={faMapLocationDot} className="text-blue-500 text-base" /></a>
        </div> */}
        <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div>
      </div>
    )
  }
}