'use client'

import MapHome from "@/components/maps/mapHome";
import { ChevronDown, ChevronLeft, ChevronRight, Dot, Eye, Goal, MapPin, TrafficCone } from "lucide-react";
import { fetchGalleriesGtp } from "../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchInfoGtp, fetchListAllActiveAnnouncement } from "../api/fetchers/gtp";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import ListOurPackageSection from "./our-package/_components/listMyPackage";
import GeneralInfo from "./_components/generalInfo";
import Package from "./_components/package";
import { fetchListGeomHomestay } from "../api/fetchers/homestay";
import { fetchListGeomSouvenir } from "../api/fetchers/souvenir";
import { fetchListGeomCulinary } from "../api/fetchers/culinary";
import { fetchListGeomWorship } from "../api/fetchers/worhsip";
import ObjectAroundSection from "./_components/objectAround";
import MapHomeUpdate from "@/components/maps/mapHomeUpdate";
import BrowsePackage from "./_components/browsePackage";

interface UserLocation {
  lat: number;
  lng: number;
}

interface Visibility {
  country: boolean;
  province: boolean;
  cityRegency: boolean;
  district: boolean;
  village: boolean;
}
interface VisibilityObject {
  attraction: boolean;
  worshipPlace: boolean;
  culinaryPlace: boolean;
  homestay: boolean;
  souvenirPlace: boolean;
}
interface dataListGeom {
  id: string;
  name: string;
  address: string
  contact_person: string | null;
  capacity: number | null;
  status: number | null;
  lat: number;
  lng: number;
}
interface MapType {
  culinaryPlaces: boolean;
  homestay: boolean;
  souvenirPlaces: boolean;
  worshipPlaces: boolean;
}
interface WeatherData {
  description: string;
  temperature: number;
  humidity: number;
  icon: string;
  windSpeed: number;
}

export default function ExplorePage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [goToObject, setGoToObject] = useState(false)
  const [allObject, setAllObject] = useState(false)
  const [traffic, setTraffic] = useState(false)
  const [reachToObject, setReachToObject] = useState(false)
  const [showLegend, setShowLegend] = useState(false);
  const [browseId, setBrowseId] = useState<string | null>(null);
  const [browseName, setBrowseName] = useState<string | null>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isDropdownObjectVisible, setDropdownObjectVisible] = useState(false);
  const [distances, setDistances] = useState<number[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [packageSection, setPackageSection] = useState(false);
  const [dataTypeMap, setDataTypeMap] = useState<dataListGeom[] | null>(null)
  const [listExploreUlakan, setListExploreUlakan] = useState(true);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [isBrowseClicked, setIsBrowseClicked] = useState(false);
  const [radius, setRadius] = useState(0)
  const [showLabels, setShowLabels] = useState<boolean>(true); // State untuk labels
  const [showTerrain, setShowTerrain] = useState<boolean>(false); // State untuk terrain
  const [daySelectActivities, setDaySelectActivities] = useState<any[]>([]);
  const [selectActivities, setSelectActivities] = useState<{ start: any; end: any } | null>(null);
  const [mapWeather, setMapWeather] = useState<WeatherData | null>(null);
  const [visibility, setVisibility] = useState<Visibility>({
    country: true,
    province: false,
    cityRegency: false,
    district: false,
    village: false,
    // stepsInformation: false,
  });
  const [visibilityObject, setVisibilityObject] = useState<VisibilityObject>({
    attraction: false,
    worshipPlace: false,
    culinaryPlace: false,
    homestay: false,
    souvenirPlace: false,
  });
  const [objectAroundState, setObjectAroundState] = useState<MapType>({
    culinaryPlaces: false,
    homestay: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });
  const { data:announcements, error } = useQuery({
    queryKey: ['dataAllActiveAnnouncement'],
    queryFn: () => fetchListAllActiveAnnouncement()
  })
  const { isLoading: loadingListGeomWorship, data: dataListGeomWorship } = useQuery({
    queryKey: ['geomWorship'],
    queryFn: fetchListGeomWorship
  })
  const { isLoading: loadingGalleries, data: dataGalleries } = useQuery({
    queryKey: ['galleriesGtp'],
      queryFn: fetchGalleriesGtp,
  })
    const { isLoading: loadingListGeomCulinary, data: dataListGeomCulinary } = useQuery({
      queryKey: ['listGeomCulinary'],
      queryFn: fetchListGeomCulinary,
    })
    const { isLoading: loadingListGeomSouvenir, data: dataListGeomSouvenir } = useQuery({
      queryKey: ['geomSouvenir'],
      queryFn: fetchListGeomSouvenir
    })
    const { isLoading: loadingListGeomHomestay, data: dataListGeomHomestay } = useQuery({
      queryKey: ['listGeomHomestay'],
      queryFn: fetchListGeomHomestay
    })
  
  // const queryMutiple = () => {
  //   const resGalleries = useQuery({
  //     queryKey: ['galleriesGtp'],
  //     queryFn: fetchGalleriesGtp,
  //   })
  //   const resInfo = useQuery({
  //     queryKey: ['infoGtp'],
  //     queryFn: fetchInfoGtp
  //   })
  //   return [resGalleries, resInfo]
  // }

  // const [
  //   { isLoading: loadingGalleries, data: dataGalleries },
  //   { isLoading: loadingInfo, data: dataInfo }
  // ] = queryMutiple()

  // useEffect(() => {
  //   if (dataGalleries) {
  //     const interval = setInterval(() => {
  //       setCurrentIndex(prevIndex => (prevIndex + 1) % dataGalleries.length);
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }
  //   // Membersihkan interval saat komponen di-unmount
  // }, [dataGalleries]);

  const fetchUserLocation = async (): Promise<void> => {
    try {
      const position = await getCurrentPosition();
      console.log(position);
      
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('gabisa nih');
        
        reject(new Error("Geolocation is not supported by this browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const goToObjectHandler = () => {
    setGoToObject(true)
  }

  const allObjectHandler = () => {
    setAllObject(!allObject)
  }

  const trafficHandler = () => {
    setTraffic(!traffic)
  }

  const reachToObjectHandler = () => {
    setVisibility(prevState => ({
      ...prevState,  // Keep the previous state values
      country: true  // Set 'country' to true
    }));
    setReachToObject(!reachToObject)
  }

  const showLegendHandler = () => {
    setShowLegend((prev) => !prev); // Toggle nilai showLegend
  };

  const handleCheckboxChange = (key: keyof Visibility) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCheckboxObjectChange = (key: keyof VisibilityObject) => {
    setVisibilityObject((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePackageSection = () => {
    setBrowseId(null)
    setPackageSection(!packageSection);
  };

  const handleShowMapClick = (type: string) => {
    if (type === 'culinary') setDataTypeMap(dataListGeomCulinary)
    else if (type === 'worship') setDataTypeMap(dataListGeomWorship)
    else if (type === 'souvenir') setDataTypeMap(dataListGeomSouvenir)
    else setDataTypeMap(dataListGeomHomestay)
  };

  const handleSelectActivity = (start:any, end:any) => {
    // console.log("Selected Route:", start, "to", end);
    setSelectActivities({
      start:start,
      end:end
    })
    setDaySelectActivities([])
    // You can use this data to create the route on Google Maps.
  };

  const handleDaySelect = (activities:any) => {
    setDaySelectActivities(activities);
    setSelectActivities(null)
    // console.log("Selected day's activities:", activities);
    // You can use these activities for Google Maps or other processing
  };

  const handleSection = () => {
    setListExploreUlakan(!listExploreUlakan);
    setDataTypeMap(null)
    setRadius(0)
  };

  const handleObjectAroundStateChange = (newState: any) => {
    setObjectAroundState(newState);
  }

  const handleRadiusChange = (value: number) => {
    setRadius(value)
  }

  const handleManualLocationUpdate = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    if (dialogElement) dialogElement.showModal();
  };

  const handleBrowsePlace = () => {
    const dialogElement = document.getElementById('browsePlace') as HTMLDialogElement;
    if (dialogElement) dialogElement.showModal();
  };

  const handleModalOk = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    if (dialogElement) {
      setIsManualLocationClicked(true);
      dialogElement.close();
    }
  };

  const handleModalCancel = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    dialogElement.close();
  }

  const handleModalBrowseOk = () => {
    const dialogElement = document.getElementById('browsePlace') as HTMLDialogElement;
    if (dialogElement) {
      setIsBrowseClicked(true)
      setVisibilityObject(prev => ({
        ...prev,
        worshipPlace: true,
        culinaryPlace: true,
        homestay: true,
        souvenirPlace: true,
      }));
      dialogElement.close();
    }
  };

  const handleModalBrowseCancel = () => {
    const dialogElement = document.getElementById('browsePlace') as HTMLDialogElement;
    dialogElement.close();
  }

  useEffect(() => {
    const apiKey = "0ec1b86edc77ddcf8f5b6722561e564b";
      const lat = '-0.711577';
      const lng = '100.195636';
  
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

      const fetchWeather = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            //throw new Error(`HTTP error! status: ${response.status}`);
            console.log(response.status);
            
          }
          const data = await response.json();
  
          // Format data cuaca
          const weatherDescription = data.weather[0].description;
          const temperature = data.main.temp;
          const humidity = data.main.humidity;
          const weatherIcon = data.weather[0].icon;
          const windSpeed = data.wind.speed;

          setMapWeather({
            description: weatherDescription,
            temperature,
            humidity,
            icon: weatherIcon,
            windSpeed,
          });

          console.log("Weather Data:", {
            description: weatherDescription,
            temperature,
            humidity,
            icon: weatherIcon,
            windSpeed,
          });
          console.log(mapWeather);
          
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
  
      fetchWeather();
  },[])

  return (
    <>
      <div className="flex flex-col m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-2 mb-3 lg:p-0 lg:mb-0 lg:mr-3 bg-white rounded-lg">
          {announcements!==undefined && announcements.length>0 && (
            <div className="m-1 lg:m-4">
              <h3 className="text-red-500">
                <FontAwesomeIcon icon={faBullhorn} /> Announcement
              </h3>
              <ul className="list-disc list-inside mx-8 space-y-2">
                {announcements?.map((announcement: { description: string }) => (
                  <li key={announcement.description} className="text-justify font-semibold">
                    {announcement.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row m-1 sm:m-2 lg:m-4">
        <div className="w-full h-full px-1 py-2 mb-2 lg:p-0 lg:mb-0 lg:mr-3 lg:w-2/3 bg-white rounded-lg">
          <div className="flex-1 flex-col ml-10 sm:m-1 md:flex-row h-auto select-none">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-semibold md:ml-3">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Current Location" role="button" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Set Manual Location" onClick={handleManualLocationUpdate}>
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Toggle Legend" role="button" onClick={showLegendHandler}>
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Enable Traffic" role="button" onClick={trafficHandler}>
                <TrafficCone className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="Go To Object" role="button" onClick={goToObjectHandler}>
                Go to Object
              </div>
              {/* Checkbox untuk Labels dan Terrain */}
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showLabels"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="form-checkbox"
                />
                <label htmlFor="showLabels" className="text-sm">
                  Labels
                </label>
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showTerrain"
                  checked={showTerrain}
                  onChange={(e) => setShowTerrain(e.target.checked)}
                  className="form-checkbox"
                />
                <label htmlFor="showTerrain" className="text-sm">
                  Terrain
                </label>
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="How to Reach Object" role="button" onClick={reachToObjectHandler}>
                How to Reach Object
              </div>
              <div className="relative" title="Object" >
                <button
                  className="flex p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white"
                  onClick={() => setDropdownObjectVisible(!isDropdownObjectVisible)}
                >
                  Object
                  <ChevronDown
                className={`${isDropdownObjectVisible && 'rotate-180'}`}
              />
                </button>
                {/* Dropdown Content */}
                {isDropdownObjectVisible && (
                  <div className="absolute top-12 left-0 z-10 w-48 p-2 bg-white rounded-lg shadow-lg" onMouseLeave={() => setDropdownObjectVisible(false)}>
                    <ul className="flex flex-col gap-2">
                      {Object.keys(visibilityObject).map((key) => (
                        <li key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={visibilityObject[key as keyof VisibilityObject]}
                            onChange={() =>
                              handleCheckboxObjectChange(key as keyof VisibilityObject)
                            }
                            className="form-checkbox"
                          />
                          <label htmlFor={key} className="text-sm text-gray-800">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative" title="Digitization" >
                <button
                  className="flex p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white"
                  onClick={() => setDropdownVisible(!isDropdownVisible)}
                >
                  Digitization
                  <ChevronDown
                className={`${isDropdownVisible && 'rotate-180'}`}
              />
                </button>
                {/* Dropdown Content */}
                {isDropdownVisible && (
                  <div className="absolute top-12 left-0 z-10 w-48 p-2 bg-white rounded-lg shadow-lg" onMouseLeave={() => setDropdownVisible(false)}>
                    <ul className="flex flex-col gap-2">
                      {Object.keys(visibility).map((key) => (
                        <li key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={visibility[key as keyof Visibility]}
                            onChange={() =>
                              handleCheckboxChange(key as keyof Visibility)
                            }
                            className="form-checkbox"
                          />
                          <label htmlFor={key} className="text-sm text-gray-800">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="Package" role="button" 
                onClick={togglePackageSection}>
                {packageSection ? "General Information" : "Package"}
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="Browse Place" role="button" onClick={handleBrowsePlace}>
                Browse Place
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-center">
            <span >Ulakan, ID</span>
            <img className="w-12"  src={`http://openweathermap.org/img/wn/${mapWeather?.icon}.png`} alt="Weather Icon" />
            <span className="capitalize">{mapWeather?.description}</span>
            <span>{mapWeather?.temperature}°C</span>
            <span>Humidity:{mapWeather?.humidity}%</span>
            <span>Wind:{mapWeather?.windSpeed}m/s</span>
          </div>
          <div className="pb-4 md:mx-2">
            {/* <MapHome userLocation={userLocation} 
            objectAround={objectAroundState} dataMapforType={dataTypeMap} radius={radius}
            isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked} setUserLocation={setUserLocation}
            goToObject={goToObject} setGoToObject={setGoToObject} 
            showLegend={showLegend} visibility={visibility}
            reachToObject={reachToObject}
            traffic={traffic} object={visibilityObject}
            distances={distances} setDistances={setDistances}
            instructions={instructions} setInstructions={setInstructions}
            dayActivities={daySelectActivities} selectActivities={selectActivities}
            // isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
            // setUserLocation={setUserLocation}
            /> */}
            <MapHomeUpdate userLocation={userLocation} 
            objectAround={objectAroundState} dataMapforType={dataTypeMap} radius={radius}
            isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked} setUserLocation={setUserLocation}
            goToObject={goToObject} setGoToObject={setGoToObject} 
            showLegend={showLegend} visibility={visibility}
            reachToObject={reachToObject}
            traffic={traffic} object={visibilityObject}
            distances={distances} setDistances={setDistances}
            instructions={instructions} setInstructions={setInstructions}
            dayActivities={daySelectActivities} selectActivities={selectActivities}
            showLabels={showLabels} setShowLabels={setShowLabels}
            showTerrain={showTerrain} setShowTerrain={setShowTerrain}
            browsePlace={isBrowseClicked} setBrowseId={setBrowseId}
            setBrowseName={(setBrowseName)}
            // isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
            // setUserLocation={setUserLocation}
            />
          </div>
        </div>
        {browseId !== null ? (
          <BrowsePackage browseId={browseId} browseName={browseName}
            onSearchAroundClick={handleSection} onShowMapClick={handleShowMapClick}
            onSelectActivity={handleSelectActivity}
            onDaySelect={handleDaySelect}
          />
        ): packageSection ? (
          listExploreUlakan ? (
            <Package onSearchAroundClick={handleSection} onShowMapClick={handleShowMapClick}
            onSelectActivity={handleSelectActivity}
            onDaySelect={handleDaySelect} />
          ) : (
            <ObjectAroundSection 
              onCloseClick={handleSection}
              onRadiusChange={handleRadiusChange}
              onStateChange={handleObjectAroundStateChange}
            />
          )
        ): (
          <GeneralInfo />
        )}
      </div>
      {distances !== null && distances.length !== 0 && (
        <div className="flex flex-col lg:flex-row mx-1 sm:mx-3 lg:mx-5 mt-3 mb-10">
          <div className="w-full h-full p-2 bg-white rounded-lg">
            <h1 className="text-center font-semibold text-lg">Directions</h1>
            <table className="w-full">
              <thead className="text-center font-medium">
                <tr>
                  <th>Distance&nbsp;(m)</th>
                  <th>Steps</th>
                </tr>
              </thead>
              <tbody>
                {distances.map((distace, index) => (
                  <tr key={index}>
                    <td className="text-center">{distace}</td>
                    <td dangerouslySetInnerHTML={{ __html: instructions[index] }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer/>
      {/* Modal */}
      <dialog id="manualLocationDialog" className="bg-white p-12 mt-72 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center font-bold">Confirmation</h2>
        <p>Want to set manual location?</p>
        <div className="mt-4 flex justify-center">
          <button onClick={handleModalOk} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded mr-2">
            Yes
          </button>
          <button onClick={handleModalCancel} className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-800 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </dialog>
      <dialog id="browsePlace" className="bg-white p-12 mt-72 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center font-bold">Confirmation</h2>
        <p>Please, choose a object/place to see available tour packages</p>
        <div className="mt-4 flex justify-center">
          <button onClick={handleModalBrowseOk} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded mr-2">
            Yes
          </button>
          <button onClick={handleModalBrowseCancel} className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-800 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </dialog>
    </>
  )
}