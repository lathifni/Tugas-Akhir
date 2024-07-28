'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import useAxiosAuth from "../../../libs/useAxiosAuth"
import { MapContentCulinaryPlaces, MapContentWorshipPlaces, MapContentSouvenirPlaces, MapContentHomestayPlaces, Legend } from "./mapHelper"
import { createRoot } from 'react-dom/client';

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

interface MapExploreUlakanProps {
  userLocation: UserLocation | null;
  dataMapforType: dataListGeom[] | null
  radius?: number | null;
  objectAround: MapType | null;
  isManualLocation: boolean;
  setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  distances: number[];
  instructions: string[];
  setDistances: React.Dispatch<React.SetStateAction<number[]>>;
  setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
  showLegend: boolean | false;
}

interface Step {
  distance?: {
    value?: number;
  };
  instructions?: string;
}

let map: google.maps.Map | null = null;
const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  version: 'weekly'
})
const positionGtp = {
  lat: -0.7102134517843606,
  lng: 100.19420485758688
}
let markerArray: any = {};
let routeArray: any = [];

export default function MapExploreUlakanCopy({
  userLocation, dataMapforType, radius, isManualLocation, setIsManualLocation, setUserLocation, objectAround, distances, setDistances, instructions, setInstructions, showLegend
}: MapExploreUlakanProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const legendRef = React.useRef<HTMLDivElement>(null);
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let circleRef = useRef<google.maps.Circle | null>(null);
  
  const { data: dataUlakanVillage, isLoading: loadingUlakanVillage } = useQuery({
    queryKey: ['ulakanVillage'],
    queryFn: fetchUlakanVillage,
  })
  const { data: dataGeomGtp, isLoading: loadingGeomGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })

  const initMap = async (dataUlakanVillage: any[], dataGeomGtp: any[]) => {
    const { Map } = await loader.importLibrary('maps')
    window.google = google;
    const mapOptions: google.maps.MapOptions = {
      center: positionGtp,
      zoom: 16,
      styles: [
        {
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        }
      ]
    }
    map = new Map(mapRef.current as HTMLDivElement, mapOptions)
    const digitasiVillage = new google.maps.Data()
    const digitasiGtp = new google.maps.Data()
    const infoWindow = new google.maps.InfoWindow();

    if (dataUlakanVillage && Array.isArray(dataUlakanVillage)) {
      dataUlakanVillage.forEach((item: { name: string, geom: string }) => {
        const geom = item.geom;

        digitasiVillage.addGeoJson({
          type: 'Feature',
          geometry: geom
        })

        digitasiVillage.setStyle({
          fillColor: '#ADFF2F',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiVillage.setMap(map)
      })
      digitasiVillage.addListener('click', function (event: google.maps.Data.MouseEvent) {
        infoWindow.setContent(`Nagari Ulakan`)
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {
      dataGeomGtp.forEach((item: { geom: string }) => {
        const geom = item.geom;

        digitasiGtp.addGeoJson({
          type: 'Feature',
          geometry: geom
        })

        digitasiGtp.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiGtp.setMap(map)
      })
      digitasiGtp.addListener('click', function (event: google.maps.Data.MouseEvent) {
        infoWindow.setContent(`Green Talao Park`)
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }
  };

  const setDistancesAndInstructions = (myRoute: any) => {
    distances = myRoute.steps.map((step: Step) => step.distance?.value || 0);
    instructions = myRoute.steps.map((step: Step) => step.instructions || '');
    setDistances(distances);
    setInstructions(instructions);
  };

  const handleRouteButtonClick = (lat: number, lng: number) => {
    if (userLocation) {
      routeArray.forEach((directionsRenderer: google.maps.DirectionsRenderer) => {
        directionsRenderer.setMap(null);
      });
      routeArray.length = 0;
      const directionsService = new google.maps.DirectionsService();

      let start: google.maps.LatLng, end: google.maps.LatLng;
      start = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      end = new google.maps.LatLng(lat, lng)
      console.log(end, 'nilai end nihhh');
      
      const request: google.maps.DirectionsRequest = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
      ) {
        if (status === 'OK' && result !== null) {
          const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
          directionsRenderer.setDirections(result);
          routeArray.push(directionsRenderer);
          directionsRenderer.setMap(map);

          const myRoute = result.routes[0].legs[0];
          setDistancesAndInstructions(myRoute);
          boundToRoute(start, end);
        }
      });
    }
  }

  const boundToRoute = (start: google.maps.LatLng, end: google.maps.LatLng) => {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map?.fitBounds(bounds);
  };

  const setShowLegendVisibility = () => {
    if (legendRef.current) {
      const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
      if (legendContent) legendContent.style.display = showLegend ? 'block' : 'none';
    }
  };

  const generateMarkerCulinaryPlaces = (item: dataListGeom) => {
    const { id, name, address, contact_person, status, lat, lng } = item
    const pos = new google.maps.LatLng(lat, lng)
    const marker = new google.maps.Marker();

    const markerOptions = {
      position: pos,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: status === 1 ? '/icon/cpgtp.png' : '/icon/culinary.png'
    }
    marker.setOptions(markerOptions)
    marker.addListener('click', () => {
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)

      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentCulinaryPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateMarkerWorshipPlaces = (item: dataListGeom) => {
    const { id, name, address, capacity, lat, lng } = item
    const pos = new google.maps.LatLng(lat, lng)
    const marker = new google.maps.Marker();

    const markerOptions = {
      position: pos,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: '/icon/worship.png'
    }
    marker.setOptions(markerOptions)
    marker.addListener('click', () => {
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (capacity) root.render(<MapContentWorshipPlaces id={id} name={name} address={address} capacity={capacity} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container),
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateSouvenirPlace = (item: dataListGeom) => {
    const { id, name, address, contact_person, status, lat, lng } = item
    const pos = new google.maps.LatLng(lat, lng)
    const marker = new google.maps.Marker();

    const markerOptions = {
      position: pos,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: '/icon/souvenir.png'
    }
    marker.setOptions(markerOptions)
    marker.addListener('click', () => {
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentSouvenirPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateHomestayPlace = (item: dataListGeom) => {
    const { id, name, address, contact_person, lat, lng } = item
    const pos = new google.maps.LatLng(lat, lng)
    const marker = new google.maps.Marker();

    const markerOptions = {
      position: pos,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: '/icon/homestay.png'
    }
    marker.setOptions(markerOptions)
    marker.addListener('click', () => {
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentHomestayPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  useEffect(() => {
    initMap(dataUlakanVillage, dataGeomGtp);
  }, [dataGeomGtp, dataUlakanVillage])

  useEffect(() => {
    setShowLegendVisibility();
  }, [showLegend]);

  useEffect(() => {
    Object.keys(markerArray).forEach((key) => {
      const marker = markerArray[key] as google.maps.Marker;
      marker.setMap(null);
    });
    markerArray = {};
    if (dataMapforType !== null) {
      const firstIdData = dataMapforType[0].id

      routeArray.forEach((directionsRenderer: google.maps.DirectionsRenderer) => {
        directionsRenderer.setMap(null);
      });
      routeArray.length = 0;
      setDistances([])
      setInstructions([])

      if (firstIdData.startsWith("CP")) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateMarkerCulinaryPlaces(item)
        })
      } else if (firstIdData.startsWith('WP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateMarkerWorshipPlaces(item)
        })
      } else if (firstIdData.startsWith('SP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateSouvenirPlace(item)
        })
      } else {
        dataMapforType.forEach((item: dataListGeom) => {
          generateHomestayPlace(item)
        })
      }
      if (Object.keys(markerArray).length > 0 && map) {
        const bounds = new google.maps.LatLngBounds();
        for (const i in markerArray) {
          const positionArray = markerArray[i].getPosition();
          if (positionArray) bounds.extend(positionArray);
        }
        map.fitBounds(bounds);
      }
    }
  }, [dataMapforType, userLocation])

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (userLocation !== null && map) {
        // console.log(isManualLocation, 'di userLocation');
        setIsManualLocation(false)
        if (locationMarkerRef.current !== null) locationMarkerRef.current.setMap(null);
        const newMarkerLocation = new google.maps.Marker();
        const markerOptions = {
          position: userLocation,
          map: map,
          animation: google.maps.Animation.DROP,
        }
        newMarkerLocation.setOptions(markerOptions)

        infoWindowLocMarkerRef.current = new google.maps.InfoWindow({
          content: `<p>You Are Here</p>`
        });
        newMarkerLocation.addListener('click', () => {
          infoWindowLocMarkerRef.current?.open(map, newMarkerLocation);
        });
        locationMarkerRef.current = newMarkerLocation
        infoWindowLocMarkerRef.current?.open(map, locationMarkerRef.current)
      }
    }
    fetchUserLocation()
  }, [userLocation])

  useEffect(() => {
    // console.log(isManualLocation, 'di isManualLocation');
    let clickListener: google.maps.MapsEventListener | null = null;
    const handleMapClick = (mapsMouseEvent: any) => {
      const newLocation = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng()
      };
      setUserLocation({
        lat: newLocation.lat,
        lng:newLocation.lng
      });
      console.log(newLocation);
      console.log(userLocation);

      if (clickListener) {
        clickListener.remove();
        clickListener = null;
      }
    };
    if (isManualLocation === true && map) clickListener = map.addListener('click', handleMapClick);

    return () => {
      if (clickListener) {
        clickListener.remove();
      }
    };
  }, [isManualLocation])

  useEffect(() => {
    const fetchObjectAroundRadius = async () => {
      if (userLocation && map && locationMarkerRef.current && radius !== null) {
        Object.keys(markerArray).forEach((key) => {
          const marker = markerArray[key] as google.maps.Marker;
          marker.setMap(null);
        });
        markerArray = {};

        if (circleRef.current !== null) circleRef.current.setMap(null)
        const circle = new google.maps.Circle({
          map: map,
          radius: radius,  // dalam meter
          fillColor: '#AA0000',
          fillOpacity: 0.3,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2
        });
        circleRef.current = circle
        circleRef.current.bindTo('center', locationMarkerRef.current, 'position')

        infoWindowLocMarkerRef.current?.open(map, locationMarkerRef.current);
        map.panTo(userLocation);
        locationMarkerRef.current = locationMarkerRef.current;

        if (objectAround && radius) {
          const lat = userLocation.lat
          const lng = userLocation.lng
          if (objectAround.culinaryPlaces === true) {
            try {
              const res = await useAxiosAuth.get(`/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
              const dataObject = res.data.data
              dataObject.forEach((item: dataListGeom) => {
                generateMarkerCulinaryPlaces(item)
              });
            } catch (error) {
              console.log(error);
            }
          }
          if (objectAround.worshipPlaces === true) {
            const res = await useAxiosAuth.get(`/worship/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateMarkerWorshipPlaces(item)
            })
          }
          if (objectAround.souvenirPlaces === true) {
            const res = await useAxiosAuth.get(`/souvenir/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateSouvenirPlace(item)
            })
          }
          if (objectAround.homestay === true) {
            const res = await useAxiosAuth.get(`/homestay/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateHomestayPlace(item)
            })
          }
        }
      }
    }
    fetchObjectAroundRadius()
  }, [radius])

  return (
    <div className="relative">
      <div ref={legendRef} className={`absolute bottom-6 left-2 `} style={{ zIndex: 100 }}>
        {showLegend && (
          <div className="legend-content" style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
            <Legend />
          </div>
        )}
      </div>
      <div ref={mapRef} className="text-slate-700 h-[500px] md:h-[700px] rounded-lg"></div>
    </div>
  )
}