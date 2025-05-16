'use client'

import { Eye, Goal, MapPin, TrafficCone } from "lucide-react";
import { useEffect, useState } from "react";
import MapExploreUlakan from "@/components/maps/mapExploreUlakan";
import ObjectAroundSection from "./_components/objectAround";
import { useQuery } from "@tanstack/react-query";
import { fetchListGeomCulinary } from "../../api/fetchers/culinary";
import { fetchListGeomWorship } from "../../api/fetchers/worhsip";
import { fetchListGeomSouvenir } from "../../api/fetchers/souvenir";
import { fetchListGeomHomestay } from "../../api/fetchers/homestay";
import MapExploreUlakanCopy from "@/components/maps/mapExploreUlakanCopy";
import ListOurPackageSection from "./_components/listOurPackage";
import { fetchExploreOurPackage } from "../../api/fetchers/package";

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapType {
  culinaryPlaces: boolean;
  homestay: boolean;
  souvenirPlaces: boolean;
  worshipPlaces: boolean;
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
interface WeatherData {
  description: string;
  temperature: number;
  humidity: number;
  icon: string;
  windSpeed: number;
}

export default function MyPakcagePage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [listExploreUlakan, setListExploreUlakan] = useState(true);
  const [dataTypeMap, setDataTypeMap] = useState<dataListGeom[] | null>(null)
  const [radius, setRadius] = useState(0)
  const [showLegend, setShowLegend] = useState(false);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [distances, setDistances] = useState<number[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [daySelectActivities, setDaySelectActivities] = useState<any[]>([]);
  const [selectActivities, setSelectActivities] = useState<{ start: any; end: any } | null>(null);
  const [traffic, setTraffic] = useState(false)
  const [showLabels, setShowLabels] = useState<boolean>(true); // State untuk labels
  const [showTerrain, setShowTerrain] = useState<boolean>(false); // State untuk terrain
  const [mapWeather, setMapWeather] = useState<WeatherData | null>(null);
  const [reachToObject, setReachToObject] = useState(false)
  
  const { isLoading: loadingListGeomWorship, data: dataListGeomWorship } = useQuery({
    queryKey: ['geomWorship'],
    queryFn: fetchListGeomWorship
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

  const [objectAroundState, setObjectAroundState] = useState<MapType>({
    culinaryPlaces: false,
    homestay: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });

  const handleShowMapClick = (type: string) => {
    if (type === 'culinary') setDataTypeMap(dataListGeomCulinary)
    else if (type === 'worship') setDataTypeMap(dataListGeomWorship)
    else if (type === 'souvenir') setDataTypeMap(dataListGeomSouvenir)
    else setDataTypeMap(dataListGeomHomestay)
  };

  const handleManualLocationUpdate = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
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

  const handleObjectAroundStateChange = (newState: any) => {
    setObjectAroundState(newState);
  }

  const handleRadiusChange = (value: number) => {
    setRadius(value)
  }

  const fetchUserLocation = async (): Promise<void> => {
    try {
      const position = await getCurrentPosition();
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log(userLocation);

    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
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

  const handleSection = () => {
    setListExploreUlakan(!listExploreUlakan);
    setDataTypeMap(null)
    setRadius(0)
  };

  const showLegendHandler = () => {
    setShowLegend((prev) => !prev); // Toggle nilai showLegend
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

    const trafficHandler = () => {
      setTraffic(!traffic)
    }
  
    const reachToObjectHandler = () => {
      // setVisibility(prevState => ({
      //   ...prevState,  // Keep the previous state values
      //   country: true  // Set 'country' to true
      // }));
      setReachToObject(!reachToObject)
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
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-4">
        <div className="w-full h-full px-1 py-1 mb-3 lg:p-0 lg:mb-0 lg:mr-3 sm:py-3 lg:w-2/3 bg-white rounded-lg">
          <div className="flex-1 flex-col ml-10 sm:m-1 md:flex-row h-auto select-none">
            <div className=" flex items-center justify-center">
              <h1 className="text-2xl font-semibold md:ml-3">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-4 justify-center">
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Current Location" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Set Manual Location" onClick={handleManualLocationUpdate}>
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Toggle Legend" onClick={showLegendHandler}>
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Enable Traffic" role="button" onClick={trafficHandler}>
                <TrafficCone className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="How to Reach Object" role="button" onClick={reachToObjectHandler}>
                How to Reach Object
              </div>
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
          <div className="pb-5 md:mx-3">
            <MapExploreUlakanCopy
              userLocation={userLocation} objectAround={objectAroundState}
              dataMapforType={dataTypeMap} radius={radius}
              isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked} setUserLocation={setUserLocation}
              distances={distances} setDistances={setDistances}
              instructions={instructions} setInstructions={setInstructions} 
              showLegend={showLegend} dayActivities={daySelectActivities}
              selectActivities={selectActivities} 
              showLabels={showLabels} setShowLabels={setShowLabels}
              showTerrain={showTerrain} setShowTerrain={setShowTerrain}
              traffic={traffic} reachToObject={reachToObject}/>
          </div>
        </div>
        {listExploreUlakan ? (
          <ListOurPackageSection onSearchAroundClick={handleSection} onShowMapClick={handleShowMapClick}
          onSelectActivity={handleSelectActivity} onDaySelect={handleDaySelect} />
        ) : (
          <ObjectAroundSection
            onCloseClick={handleSection}
            onRadiusChange={handleRadiusChange}
            onStateChange={handleObjectAroundStateChange} />
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
    </>
  )
}