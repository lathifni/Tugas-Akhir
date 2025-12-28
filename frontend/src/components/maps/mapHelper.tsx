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
  price: string|null;
}

interface MapContentCulinaryPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onAddToRoute?: () => void; // <<< NEW (opsional)
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
  onAddToRoute?: () => void; // <<< NEW (opsional)
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
  onAddToRoute?: () => void; // <<< NEW (opsional)
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
  onAddToRoute?: () => void; // <<< NEW (opsional)
}

interface MapContentHomestayPlacesProps {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  lat: number;
  lng: number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onAddToRoute?: () => void; // <<< NEW (opsional)
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
  // category: string;
  price: number;
  explore: number
  lat:number;
  lng:number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onAddToRoute?: () => void; // <<< NEW (opsional)
}

interface MapAttractionBrowseContentProps {
  id: string;
  name: string;
  type: string;
  price: number;
  explore: number
  lat:number;
  lng:number;
  onRouteClick: (latObject: number, lngObject: number) => void;
  onBrowseRespond: (id:string, name:string) => void;
  browse: boolean | false;
}

export const MapContentGeneral: React.FC<MapContentGeneralProps> = ({id,name,icon,address,contact_person,capacity,lat,lng,onRouteClick,price}) => {
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
        <p className="flex m-1 text-base justify-center"><User className="mr-2" />{contact_person}</p>
      )}
      {capacity && (
        <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{capacity}</p>
      )}
      {price && price != '0' && (
        <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-2" />{price}</p>
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

export const MapContentCulinaryPlaces: React.FC<MapContentCulinaryPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, onAddToRoute }) => {  
  const addressHref = `/explore/culinary/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      {/* <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div> */}
      <div className="flex justify-center text-lg">
        {/* Jika onAddToRoute ada => mode Travel Planning: tampilkan +Add + Info */}
        {onAddToRoute ? (
          <>
            <button
              type="button"
              title="Add to Route"
              onClick={onAddToRoute}
              className="border-2 border-blue-500 rounded-lg px-3 py-2 m-1 text-blue-500 font-medium"
            >
              + Add
            </button>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        ) : (
          /* Default: tombol Route + Info */
          <>
            <div
              role="button"
              title="Route"
              onClick={routeClickHandler}
              className="border-2 border-blue-500 rounded-lg p-2 m-1"
            >
              <FontAwesomeIcon icon={faRoad} className="text-blue-500" />
            </div>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        )}
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

export const MapContentWorshipPlaces: React.FC<MapContentWorshipPlacesProps> = ({ id, name, address, capacity, lat, lng, onRouteClick, onAddToRoute }) => {
  const addressHref = `/explore/worship/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><User className="mr-2" />{capacity}</p>
      {/* <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div> */}
      <div className="flex justify-center text-lg">
        {/* Jika onAddToRoute ada => mode Travel Planning: tampilkan +Add + Info */}
        {onAddToRoute ? (
          <>
            <button
              type="button"
              title="Add to Route"
              onClick={onAddToRoute}
              className="border-2 border-blue-500 rounded-lg px-3 py-2 m-1 text-blue-500 font-medium"
            >
              + Add
            </button>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        ) : (
          /* Default: tombol Route + Info */
          <>
            <div
              role="button"
              title="Route"
              onClick={routeClickHandler}
              className="border-2 border-blue-500 rounded-lg p-2 m-1"
            >
              <FontAwesomeIcon icon={faRoad} className="text-blue-500" />
            </div>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        )}
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

export const MapContentBrowseSouvenirPlaces: React.FC<MapContentBrowseSouvenirPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, browse, onBrowseRespond, onAddToRoute}) => {
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
      {/* <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
        {browse && (
        <div role="button" title="route" onClick={() => browseRespondHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg">Browse Place</div>
        )}
      </div> */}
      <div className="flex justify-center text-lg">
        {/* Jika onAddToRoute ada => mode Travel Planning: tampilkan +Add + Info */}
        {onAddToRoute ? (
          <>
            <button
              type="button"
              title="Add to Route"
              onClick={onAddToRoute}
              className="border-2 border-blue-500 rounded-lg px-3 py-2 m-1 text-blue-500 font-medium"
            >
              + Add
            </button>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        ) : (
          /* Default: tombol Route + Info */
          <>
            <div
              role="button"
              title="Route"
              onClick={routeClickHandler}
              className="border-2 border-blue-500 rounded-lg p-2 m-1"
            >
              <FontAwesomeIcon icon={faRoad} className="text-blue-500" />
            </div>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export const MapContentHomestayPlaces: React.FC<MapContentHomestayPlacesProps> = ({ id, name, address, contact_person, lat, lng, onRouteClick, onAddToRoute }) => {
  const addressHref = `/explore/homestay/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  return (
    <div className="p-2">
      <h1 className="font-semibold text-center text-lg mb-3">{name}</h1>
      <p className="flex m-1 text-base justify-center"><Pin className="mr-2" />{address}</p>
      <p className="flex m-1 text-base justify-center"><Contact className="mr-2" />{contact_person}</p>
      {/* <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
        <a href={addressHref} title="Info" target="_blank" >
          <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
        </a>
      </div> */}
      <div className="flex justify-center text-lg">
        {/* Jika onAddToRoute ada => mode Travel Planning: tampilkan +Add + Info */}
        {onAddToRoute ? (
          <>
            <button
              type="button"
              title="Add to Route"
              onClick={onAddToRoute}
              className="border-2 border-blue-500 rounded-lg px-3 py-2 m-1 text-blue-500 font-medium"
            >
              + Add
            </button>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        ) : (
          /* Default: tombol Route + Info */
          <>
            <div
              role="button"
              title="Route"
              onClick={routeClickHandler}
              className="border-2 border-blue-500 rounded-lg p-2 m-1"
            >
              <FontAwesomeIcon icon={faRoad} className="text-blue-500" />
            </div>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        )}
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
        <img src="/icon/culinary.png" alt="" className="w-4 h-5 mr-2" /><p>Culinary Place</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/homestay.png" alt="" className="w-4 h-5 mr-2" /><p>Homestay</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/souvenir.png" alt="" className="w-4 h-5 mr-2" /><p>Souvenir Place</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/attraction.png" alt="" className="w-4 h-5 mr-2" /><p>Attraction</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/worship.png" alt="" className="w-4 h-5 mr-2" /><p>Worship Place</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/negara.png" alt="" className="w-4 h-4 mr-2" /><p>Malaysia</p>
      </div>
      {/* <div className="flex items-center mt-2">
        <img src="/icon/provinsi.png" alt="" className="w-4 h-4 mr-2" /><p>Provinsi</p>
        </div> */}
      <div className="flex items-center mt-2">
        <img src="/icon/kabkota.png" alt="" className="w-4 h-4 mr-2" /><p>Singapore</p>
      </div>
      {/* <div className="flex items-center mt-2">
        <img src="/icon/kecamatan.png" alt="" className="w-4 h-4 mr-2" /><p>Kecamatan</p>
        </div> */}
      <div className="flex items-center mt-2">
        <img src="/icon/nagari.png" alt="" className="w-4 h-4 mr-2" /><p>Brunei Darussalam</p>
      </div>
      <div className="flex items-center mt-2">
        <img src="/icon/desawisata.png" alt="" className="w-4 h-4 mr-2" /><p>GTP Ulakan</p>
      </div>
      <div className="flex items-center mt-2 ml-0.5">
        <CheckeredLegendIcon color="#A0522D" borderColor="#8B4513" /><p>Estuary</p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react';

interface Props {
  map: google.maps.Map | null;
}

export default function CustomScale({ map }: Props) {
  const [scaleText, setScaleText] = useState('100 m');
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!map) return;

    const calculateScale = () => {
      const zoom = map.getZoom() || 0;
      const lat = map.getCenter()?.lat() || 0;

      // 1. Hitung resolusi (meter/pixel) di posisi saat ini
      // Konstanta 156543.03392 berasal dari Keliling Bumi / 256 pixel (tile size)
      const metersPerPixel = (156543.03392 * Math.cos(lat * Math.PI / 180)) / Math.pow(2, zoom);

      // 2. Tentukan target jarak yang "cantik" buat ditampilkan
      // Kita mau garisnya mewakili jarak bulat (misal 50m, 100m, 1km)
      // Kita targetkan lebar garis sekitar 100 pixel di layar biar enak dilihat
      const targetWidthInPixels = 100;
      const targetDistanceInMeters = targetWidthInPixels * metersPerPixel;

      // Bulatkan angka jaraknya biar cantik (misal 134m jadi 100m, 800m jadi 1km)
      let roundedDistance = 0;
      if (targetDistanceInMeters >= 1000) {
         // Kalau > 1km, bulatkan ke km terdekat
         roundedDistance = Math.round(targetDistanceInMeters / 1000) * 1000;
      } else {
         // Kalau < 1km, bulatkan ke kelipatan 50m atau 100m
         roundedDistance = Math.round(targetDistanceInMeters / 100) * 100;
         if (roundedDistance === 0) roundedDistance = 50; // Minimal 50m
      }

      // 3. Hitung lebar garis (pixel) yang sebenarnya untuk jarak bulat tadi
      const finalWidth = roundedDistance / metersPerPixel;

      // 4. Update State UI
      setBarWidth(finalWidth);
      
      if (roundedDistance >= 1000) {
        setScaleText(`${roundedDistance / 1000} km`);
      } else {
        setScaleText(`${roundedDistance} m`);
      }
    };

    // Hitung pertama kali
    calculateScale();

    // Dengerin event zoom & geser (karena latitude ngaruh ke skala)
    const listenerZoom = map.addListener('zoom_changed', calculateScale);
    const listenerCenter = map.addListener('center_changed', calculateScale);

    return () => {
      google.maps.event.removeListener(listenerZoom);
      google.maps.event.removeListener(listenerCenter);
    };
  }, [map]);

  if (!map) return null;

  return (
    <div className="flex flex-col items-center bg-white/80 p-2">
        {/* Teks Jarak */}
        <span className="text-xs font-bold text-slate-700 mb-1 drop-shadow-md">
            {scaleText}
        </span>
        
        {/* Garis Skala */}
        <div 
            style={{ 
                width: `${barWidth}px`, 
                height: '6px',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '2px solid #334155', // Slate-700
                borderTop: 'none', // Biar bentuknya kayak penggaris U
                borderRadius: '0 0 2px 2px'
            }} 
        />
    </div>
  );
}

interface CheckeredIconProps {
    color: string;       // Warna tengah (isi)
    borderColor?: string; // Warna garis pinggir (opsional)
}

const CheckeredLegendIcon: React.FC<CheckeredIconProps> = ({ color, borderColor }) => {
    // Style Container: Cuma buat ngatur ukuran & posisi biar sejajar sama teks
    const containerStyle: React.CSSProperties = {
        width: '20px',      // Tetap 24px biar ukurannya konsisten sama icon PNG lain
        height: '20px',
        display: 'flex',    // Flex biar lingkarannya pas di tengah
        alignItems: 'center',
        // justifyContent: 'center',
        // Background kotak-kotak dihapus total
    };

    // Style Lingkaran: Fokus utamanya
    const circleStyle: React.CSSProperties = {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: color,
        border: borderColor ? `2px solid ${borderColor}` : 'none',
        boxSizing: 'border-box'
    };

    return (
        <div style={containerStyle}>
            <div style={circleStyle} />
        </div>
    );
};

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

export const MapContentAttraction: React.FC<MapAttractionContentProps> = ({ id, name, lat, lng, type, price, explore, onRouteClick, onAddToRoute }) => {  
  const addressHref = `/explore/attraction/${id}`
  const routeClickHandler = () => {
    onRouteClick(lat, lng)
  }
  
  return (
    <div className="p-1">
      <p className="text-lg font-semibold p-1 text-center">{name}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faSpa} className="mr-1" /> {type}</p>
      <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-1" />Rp{price}</p>
      {/* <div className="flex justify-center text-lg">
        <div role="button" title="route" onClick={() => routeClickHandler()} className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faRoad} className="text-blue-500" /></div>
          <a href={addressHref} title="Info" target="_blank" >
            <div role="button" title="info" className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg"><FontAwesomeIcon icon={faI} className="text-blue-500" /></div>
          </a>
      </div> */}
      <div className="flex justify-center text-lg">
        {/* Jika onAddToRoute ada => mode Travel Planning: tampilkan +Add + Info */}
        {onAddToRoute ? (
          <>
            <button
              type="button"
              title="Add to Route"
              onClick={onAddToRoute}
              className="border-2 border-blue-500 rounded-lg px-3 py-2 m-1 text-blue-500 font-medium"
            >
              + Add
            </button>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        ) : (
          /* Default: tombol Route + Info */
          <>
            <div
              role="button"
              title="Route"
              onClick={routeClickHandler}
              className="border-2 border-blue-500 rounded-lg p-2 m-1"
            >
              <FontAwesomeIcon icon={faRoad} className="text-blue-500" />
            </div>
            <a href={addressHref} title="Info" target="_blank" rel="noreferrer">
              <div className="border-2 border-blue-500 rounded-lg p-2 m-1">
                <FontAwesomeIcon icon={faI} className="text-blue-500" />
              </div>
            </a>
          </>
        )}
      </div>
    </div>
  )
  if (explore == 0) {
  }
}

export const MapContentBrowseAttraction: React.FC<MapAttractionBrowseContentProps> = ({ id, name, lat, lng, type, price, explore, onRouteClick, browse, onBrowseRespond }) => {
  console.log('ini di MapContentBrowseAttraction');
  
  if (explore == 0) {
    const addressHref = `/explore/attraction/${id}`
    const routeClickHandler = () => {
      onRouteClick(lat, lng)
    }
    const browseRespondHandler = () => {
    onBrowseRespond(id, name)
  }
    return (
      <div className="p-1">
        <p className="text-lg font-semibold p-1 text-center">{name}</p>
        <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faSpa} className="mr-1" /> {type}</p>
        <p className="text-sm text-center p-1"><FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-1" />Rp{price}</p>
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
}