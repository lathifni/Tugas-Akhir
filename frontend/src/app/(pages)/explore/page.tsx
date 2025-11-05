'use client'

import { ChevronDown, Eye, Goal, MapPin, TrafficCone } from "lucide-react";
import { fetchGalleriesGtp } from "../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchListAllActiveAnnouncement } from "../api/fetchers/gtp";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import GeneralInfo from "./_components/generalInfo";
import Package from "./_components/package";
import { fetchListGeomHomestay } from "../api/fetchers/homestay";
import { fetchListGeomSouvenir } from "../api/fetchers/souvenir";
import { fetchListGeomCulinary } from "../api/fetchers/culinary";
import { fetchListGeomWorship } from "../api/fetchers/worhsip";
import ObjectAroundSection from "./_components/objectAround";
import BrowsePackage from "./_components/browsePackage";
import { ToastContainer } from 'react-toastify';
import MapHomeUpdateNewVer from "@/components/maps/mapHomeUpdateNewVer";
import TravelPlanning from "./_components/travelPlanning";
import { toast } from 'react-toastify';

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
  uniqueAttraction: boolean;
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
  uniqueAttraction: boolean;
  attraction: boolean;
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
const EMPTY_FILTERS: MapType = {
  uniqueAttraction: false,
  attraction: false,
  culinaryPlaces: false,
  homestay: false,
  souvenirPlaces: false,
  worshipPlaces: false,
};
type Waypoint = { id:string; name:string; lat:number; lng:number };

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
  const [showLabels, setShowLabels] = useState<boolean>(false); // State untuk labels
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
    uniqueAttraction: false,
    attraction: false,
    worshipPlace: false,
    culinaryPlace: false,
    homestay: false,
    souvenirPlace: false,
  });
  // const [objectAroundState, setObjectAroundState] = useState<MapType>({
  //   attraction: false,
  //   culinaryPlaces: false,
  //   homestay: false,
  //   souvenirPlaces: false,
  //   worshipPlaces: false
  // });
  const [objectAroundState, setObjectAroundState] = useState<MapType>(EMPTY_FILTERS);
  const [activeMapMode, setActiveMapMode] = useState<'none' | 'browse' | 'radius' | 'route'>('none');
  const [travelPlanning, setTravelPlanning] = useState(false);
  const [planningStart, setPlanningStart] = useState<UserLocation | null>(null); // <-- TAMBAHKAN STATE INI
  // const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const savedWaypoints = localStorage.getItem('travelWaypoints');
    // Jika ada, pakai data lama. Jika tidak, array kosong.
    return savedWaypoints ? JSON.parse(savedWaypoints) : [];
  });
  // const handleWaypointAdded = (w: Waypoint) => {
  //   setWaypoints(prev => [...prev, w]);
  // };
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
  const objectKeys = Object.keys(visibilityObject) as (keyof VisibilityObject)[];
  const totalObj = objectKeys.length;
  const selectedObj = objectKeys.filter(k => visibilityObject[k]).length;
  const isAllObjSelected = totalObj > 0 && selectedObj === totalObj;

  const setAllObjectVisibility = (val: boolean) => {
    setVisibilityObject(
      objectKeys.reduce((acc, k) => {
        acc[k] = val;
        return acc;
      }, {} as VisibilityObject)
    );
  };
  const toggleAllObject = () => setAllObjectVisibility(!isAllObjSelected);
  const [detourType, setDetourType] = useState<'pre' | 'on' | null>(null);
  const pendingDetourRef = useRef(false);
  const GTP_GATE = { id: 'GTP_GATE', name: 'GTP Gate', lat: -0.709045, lng: 100.198671 };

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

  const planningStartRef = useRef<UserLocation | null>(null);
    useEffect(() => {
    if (!travelPlanning || !detourType) return;

    if (detourType === 'pre') {
      // pakai GTP Gate sebagai start → userLocation dipaksa ke GTP Gate
      setUserLocation({ lat: GTP_GATE.lat, lng: GTP_GATE.lng });

      // optional: seed waypoint pertama kalau kosong
      // if (waypoints.length === 0) {
      //   setWaypoints([{ id: GTP_GATE.id, name: GTP_GATE.name, lat: GTP_GATE.lat, lng: GTP_GATE.lng }]);
      // }
    } else if (userLocation) {
      setUserLocation({ lat: userLocation!.lat, lng:userLocation!.lng})
      // on-journey → start = My Location (biarkan userLocation apa adanya)
      if (userLocation && waypoints.length === 0) {
        // setWaypoints([{ id: 'MY_LOC', name: 'My Location', lat: userLocation.lat, lng: userLocation.lng }]);
      }
    }

    // mode bantu radius biar fokus ke pusat start
    // setActiveMapMode('radius');
  }, [travelPlanning, detourType]); // (cukup detourType & travelPlanning)

  // useEffect(() => {
  //   if (travelPlanning && !planningStartRef.current && userLocation) {
  //     planningStartRef.current = userLocation;
  //   }
  //   if (!travelPlanning) {
  //     planningStartRef.current = null;
  //     setWaypoints([]); // opsional: reset daftar saat keluar planning
  //   }
  // }, [userLocation]);
  useEffect(() => {
    if (travelPlanning) {
      // Logika ini berjalan saat masuk mode planning
      if (!planningStartRef.current && userLocation) {
        planningStartRef.current = userLocation;
      }
    } else {
      // Logika ini hanya berjalan saat travelPlanning menjadi false
      planningStartRef.current = null;
      // setWaypoints([]); 
    }
  }, [travelPlanning, userLocation]); // <-- UBAH DEPENDENCY-NYA

  const handleWaypointAdded = (w: Waypoint) => {
    setWaypoints(prev => [...prev, w]);
    setUserLocation({ lat: w.lat, lng: w.lng });
    setActiveMapMode('radius');
  };

  // hapus waypoint terakhir
  const handleWaypointRemove = (index: number) => {
    setWaypoints(prev => {
      const next = prev.slice(0, index); // buang item di index (biasanya terakhir)
      // pusat radius = last dari next, atau kembali ke start planning, atau userLocation sekarang
      const fallback = planningStartRef.current || userLocation;
      const center = next.length ? next[next.length - 1] : fallback;
      if (center) setUserLocation({ lat: center.lat, lng: center.lng });
      return next;
    });
  };

  const handleWaypointClear = () => {
    setWaypoints([]);
    const fallback = planningStartRef.current || userLocation;
    if (fallback) setUserLocation({ lat: fallback.lat, lng: fallback.lng });
  };

  const togglePackageSection = () => {
    setTravelPlanning(false);  // <-- ADD
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
    setActiveMapMode('route')
    // You can use this data to create the route on Google Maps.
  };

  const handleDaySelect = (activities:any) => {
    setDaySelectActivities(activities);
    setActiveMapMode('route')
    setSelectActivities(null)
    // console.log("Selected day's activities:", activities);
    // You can use these activities for Google Maps or other processing
  };

  // const ensureLocation = () => {
  //   if (userLocation) return true;
  //   toast.info('Please set your location first (use Current Location atau Set Manual Location).');
  //   const dialog = document.getElementById('manualLocationDialog') as HTMLDialogElement | null;
  //   dialog?.showModal(); // buka dialog manual location
  //   return false;
  // };
  const hasUserLocation = () => {
    return userLocation !== null;
  };

  // 2. FUNGSI UNTUK MELAKUKAN AKSI (SIDE EFFECT)
  // Fungsi ini HANYA boleh dipanggil dari dalam event handler.
  const promptForLocation = () => {
    toast.info('Please set your location first (use Current Location atau Set Manual Location).');
    const dialog = document.getElementById('manualLocationDialog') as HTMLDialogElement | null;
    dialog?.showModal(); // Buka dialog manual location
  };

  const handleSection = () => {
    if (hasUserLocation()) {
      // Jika lokasi ada, lanjutkan dengan logika utama
      setObjectAroundState(EMPTY_FILTERS);
      setTravelPlanning(false);
      setListExploreUlakan(!listExploreUlakan);
      setDataTypeMap(null)
      setRadius(0)
    } else {
      // Jika lokasi tidak ada, panggil fungsi untuk melakukan aksi
      promptForLocation();
    }
    // if (!ensureLocation()) return;   // <-- ADD
    // setTravelPlanning(false);
    // setListExploreUlakan(!listExploreUlakan);
    // setDataTypeMap(null)
    // setRadius(0)
  };

  const handleTravelPlanningSectionLama = () => {
    // if (!ensureLocation()) return;   // <-- ADD
    if (hasUserLocation()) {
      // Jika lokasi ada, lanjutkan dengan logika utama
      console.log('Location exists. Proceeding with radius search...');
      setTravelPlanning(true);
      setActiveMapMode('route');  // fokus ke fitur rute
      setListExploreUlakan(false);
      setPackageSection(false);
      setDataTypeMap(null);
      setRadius(0);
    } else {
      // Jika lokasi tidak ada, panggil fungsi untuk melakukan aksi
      promptForLocation();
    }
  }
  // === CHANGED: handleTravelPlanningSection
  const handleTravelPlanningSection = () => {
    if (hasUserLocation()) {
      setTravelPlanning(true);
      setActiveMapMode('route');
      setListExploreUlakan(false);
      setPackageSection(false);
      setDataTypeMap(null);
      setPlanningStart(userLocation); // <-- LANGSUNG SET TITIK AWAL DI SINI
      setRadius(0);

      // === ADD: buka dialog detour langsung
      openDetourDialog();
    } else {
      // minta user set lokasi dulu
      promptForLocation();
      // === ADD: tandai bahwa setelah lokasi tersedia, tampilkan dialog detour
      pendingDetourRef.current = true;
    }
  };


  const handleObjectAroundStateChange = (newState: any) => {
    // console.log(newState);
    setObjectAroundState(newState);
  }

  const handleRadiusChange = (value: number) => {
    setActiveMapMode('radius')
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
        attraction: true,
      }));
      setActiveMapMode('browse')
      dialogElement.close();
    }
  };

  const handleModalBrowseCancel = () => {
    const dialogElement = document.getElementById('browsePlace') as HTMLDialogElement;
    dialogElement.close();
  }
  const openDetourDialog = () => {
    const el = document.getElementById('detourTypeDialog') as HTMLDialogElement | null;
    el?.showModal();
  };
  const closeDetourDialog = () => {
    const el = document.getElementById('detourTypeDialog') as HTMLDialogElement | null;
    el?.close();
  };
  const cancelDetourDialog = () => {
    const el = document.getElementById('detourTypeDialog') as HTMLDialogElement | null;
    el?.close();
    // Kalau memang Cancel harus keluar dari Travel Planning, panggil handleSection di sini
    handleSection();
  };

  // === ADD: handler pilihan detour
  const handleChooseDetour = (type: 'pre' | 'on') => {
    setDetourType(type);
    closeDetourDialog();
    // (opsional) lakukan sesuatu berdasar type, mis. aktifkan mode tertentu
    // setActiveMapMode(type === 'pre' ? 'browse' : 'route');
  };

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
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
  
      fetchWeather();
  },[])

  useEffect(() => {
    if (pendingDetourRef.current && userLocation) {
      pendingDetourRef.current = false;

      // Pastikan state travel planning aktif setelah lokasi ada
      setTravelPlanning(true);
      setActiveMapMode('route');
      setListExploreUlakan(false);
      setPlanningStart(userLocation);
      setPackageSection(false);
      setDataTypeMap(null);
      setRadius(0);

      openDetourDialog();
    }
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('travelWaypoints', JSON.stringify(waypoints));
  }, [waypoints]);


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
            <div className="flex flex-wrap gap-3 justify-center">
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
              <div className="relative" title="Object">
              {/* Grouped button: kiri = toggle all, kanan = chevron buka dropdown */}
              <div className="inline-flex items-stretch rounded-lg overflow-hidden border border-blue-600 shadow-sm">
                <button
                  type="button"
                  className="flex items-center gap-2 p-2 bg-blue-500 text-white hover:bg-blue-700"
                  onClick={toggleAllObject}
                  aria-pressed={isAllObjSelected}
                  title={isAllObjSelected ? 'Deselect all' : 'Select all'}
                >
                  Object
                </button>

                <button
                  type="button"
                  className="px-2 bg-blue-500 text-white hover:bg-blue-700 border-l border-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownObjectVisible(!isDropdownObjectVisible);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isDropdownObjectVisible}
                  title="Open options"
                >
                  <ChevronDown
                    className={`${isDropdownObjectVisible ? 'rotate-180' : ''} transition-transform`}
                  />
                </button>
              </div>
              {/* Dropdown */}
              {isDropdownObjectVisible && (
                <div
                  className="absolute top-12 left-0 z-10 w-56 p-2 bg-white rounded-lg shadow-lg border"
                  role="menu"
                  onMouseLeave={() => setDropdownObjectVisible(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* <div className="flex items-center justify-between px-2 pb-2 border-b">
                    <span className="text-sm font-medium">Visibility</span>
                    <span className="text-xs text-gray-500">
                      {selectedObj === totalObj
                        ? 'All on'
                        : selectedObj === 0
                        ? 'All off'
                        : `${selectedObj} selected`}
                    </span>
                  </div> */}

                  <ul className="max-h-64 overflow-auto py-2">
                    {objectKeys.map((key) => (
                      <li key={String(key)} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          id={`obj-${String(key)}`}
                          className="h-4 w-4"
                          checked={!!visibilityObject[key]}
                          onChange={() => handleCheckboxObjectChange(key)}
                        />
                        <label htmlFor={`obj-${String(key)}`} className="text-sm text-gray-800 cursor-pointer">
                          {String(key).charAt(0).toUpperCase() + String(key).slice(1)}
                        </label>
                      </li>
                    ))}
                  </ul>

                  {/* <div className="flex items-center justify-end gap-2 px-2 pt-2 border-t">
                    <button
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() => setAllObjectVisibility(false)}
                    >
                      Disable all
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setAllObjectVisibility(true)}
                    >
                      Enable all
                    </button>
                  </div> */}
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
            {/* <MapHomeUpdate userLocation={userLocation} 
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
            isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
            setUserLocation={setUserLocation} /> */}
            <MapHomeUpdateNewVer userLocation={userLocation} 
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
            activeMapMode={activeMapMode}
            setActiveMapMode={setActiveMapMode}
            isTravelPlanning={travelPlanning}
            onWaypointAdded={handleWaypointAdded}
            planningWaypoints={waypoints}
            planningStart={planningStart} // <-- KIRIM STATE BARU SEBAGAI PROP
            // isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
            // setUserLocation={setUserLocation}
            />
          </div>
        </div>
        {/* {browseId !== null ? (
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
        ): listExploreUlakan? (
          <GeneralInfo 
            onSearchAroundClick={handleSection}
            onCreatePlanClick={handleTravelPlanningSection}
          />
          ):( 
            <ObjectAroundSection 
              onCloseClick={handleSection}
              onRadiusChange={handleRadiusChange}
              onStateChange={handleObjectAroundStateChange}
            />
          )
        } */}
        {travelPlanning ? (
          <TravelPlanning 
            onCloseClick={handleSection}
            // onCloseClick={() => setTravelPlanning(false)}
            onRadiusChange={handleRadiusChange}
            onStateChange={handleObjectAroundStateChange}
            waypoints={waypoints}
            onRemove={handleWaypointRemove}
            onClear={handleWaypointClear}
            startLabel={detourType === 'pre' ? 'GTP Gate' : 'My Location'}
          />
        ) : browseId !== null ? (
          <BrowsePackage browseId={browseId} browseName={browseName}
            onSearchAroundClick={handleSection} onShowMapClick={handleShowMapClick}
            onSelectActivity={handleSelectActivity}
            onDaySelect={handleDaySelect}
          />
        ) : packageSection ? (
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
        ) : listExploreUlakan ? (
          <GeneralInfo 
            onSearchAroundClick={handleSection}
            onCreatePlanClick={handleTravelPlanningSection}
          />
        ) : ( 
          <ObjectAroundSection 
            onCloseClick={handleSection}
            onRadiusChange={handleRadiusChange}
            onStateChange={handleObjectAroundStateChange}
          />
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
      {/* === ADD: Dialog pilih detour type */}
      <dialog id="detourTypeDialog" className="bg-white p-12 mt-72 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center font-bold">Journey Phase</h2>
        <p className="mb-4 text-center">Choose your journey phase type for this travel route</p>
        <div className="mt-2 flex justify-center gap-3">
          <button
            onClick={() => handleChooseDetour('pre')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Pre-journey
          </button>
          <button
            onClick={() => handleChooseDetour('on')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
          >
            On-journey
          </button>
          <button
            onClick={cancelDetourDialog}
            className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </dialog>
     
    </>
  )
}