'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { createRoot } from 'react-dom/client';
import { Legend, MapContentAttraction } from "./mapHelper";
import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp";
import { fetchListGeomHomestay } from "@/app/(pages)/api/fetchers/homestay";
import { fetchGeomEstuary, fetchGeomMakam, fetchGeomTracking, fetchGeomTrip, fetchListGeomAttractions } from "@/app/(pages)/api/fetchers/attraction";

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapAttractionProps {
  userLocation: UserLocation | null;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  isManualLocation: boolean;
  setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showLegend: boolean | false;
  detailEventId: string | null;
  selectedAttractionId: string;
}

let map: google.maps.Map | null = null;
const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  version: 'weekly'
})
const position = {
  lat: -0.7102134517843606,
  lng: 100.19420485758688
}
let markerArray: any = {};
let routeArray: any = [];

export default function MapAttraction({ detailEventId, selectedAttractionId, userLocation, setUserLocation, isManualLocation, setIsManualLocation, showLegend }: MapAttractionProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let markerRefs = useRef<{ [id: string]: google.maps.Marker | null }>({});
  const legendRef = React.useRef<HTMLDivElement>(null);
  let dataAttarctionForMap: any

  if (detailEventId === null) {
    const { data: data, isLoading: loadingGeomAttractions } = useQuery({
      queryKey: ['listGeomAttraction'],
      queryFn: fetchListGeomAttractions
    })
    dataAttarctionForMap = data
    console.log(dataAttarctionForMap);
  } else {
    const { data: data, isLoading: loadingGeomAttractions } = useQuery({
      queryKey: ['listGeomAttraction'],
      queryFn: fetchListGeomAttractions,
      select: (data) =>
        data?.filter((item: { id: string, name: string, type: string, price: number, description: string, lat: number, lng: number, geom: string }) => item.id === detailEventId),
    })
    dataAttarctionForMap = data
    console.log(dataAttarctionForMap);
    console.log(detailEventId);
    
  }

  const { data: dataGeomGtp, isLoading: loadingGeomGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })

  const initMap = async (dataAttarctionForMap: any[], dataGeomGtp: any[]) => {
    const { Map } = await loader.importLibrary('maps')
    window.google = google;

    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 19,
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
    const digitasiEstuary = new google.maps.Data()

    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {
      dataGeomGtp.forEach((item: { id: string, name: string, geom: string }) => {
        const { id, name } = item
        const geom: string = JSON.parse(item.geom)

        digitasiVillage.addGeoJson({
          type: 'Feature',
          properties: { id, name },
          geometry: geom
        })

        digitasiVillage.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiVillage.setMap(map)
      })
    }
    if (dataAttarctionForMap && Array.isArray(dataAttarctionForMap)) {
      dataAttarctionForMap.forEach((item: { id: string, name: string, type: string, price: number, description: string, lat: number, lng: number, geom: string }) => {
        const marker = new google.maps.Marker()
        const { id, name, type, price, lat, lng } = item
        const geom: string = JSON.parse(item.geom)
        console.log(geom);

        const markerOptions = {
          map: map,
          position: { lat, lng },
          title: name,
          animation: google.maps.Animation.DROP,
          icon: '/icon/attraction.png',
        }
        marker.setOptions(markerOptions)

        markerRefs.current[id] = marker
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE)
          setTimeout(() => {
            marker.setAnimation(null)
          }, 1700)
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentAttraction id={id} name={name} type={type} price={price} explore={0} />)
          // infoWindow.open(map, marker);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
        markerArray[id] = marker
        digitasiEstuary.addGeoJson({
          type: 'Feature',
          geometry: geom
        })
        digitasiEstuary.setStyle({
          fillColor: '#ffffff',
          strokeWeight: 0.8,
          strokeColor: '#FF0000',
          fillOpacity: 0.35,
          clickable: false
        })
        digitasiEstuary.setMap(map)
      });
    }
    if (userLocation !== null && map) {
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
    if (Object.keys(markerArray).length > 0 && map && dataAttarctionForMap) {
      const bounds = new google.maps.LatLngBounds();
      for (const i in markerArray) {
        const positionArray = markerArray[i].getPosition();
        if (positionArray) bounds.extend(positionArray);
      }
      map.fitBounds(bounds);
      if (locationMarkerRef.current !== null) {
        const position = locationMarkerRef.current.getPosition()
        if (position !== null && position !== undefined) bounds.extend(position)
      }
      digitasiEstuary.forEach(feature => {
        // Check if feature and feature.getGeometry() are not null or undefined
        if (feature !== null && typeof feature.getGeometry === 'function') {
          const geometry = feature.getGeometry();

          // Ensure that forEachLatLng exists on geometry
          if (geometry && typeof geometry.forEachLatLng === 'function') {
            geometry.forEachLatLng(latLng => {
              bounds.extend(latLng);
            });
          }
        }
      });
    }
  }

  const setShowLegendVisibility = () => {
    if (legendRef.current) {
      const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
      if (legendContent) legendContent.style.display = showLegend ? 'block' : 'none';
    }
  };

  useEffect(() => {
    console.log(dataAttarctionForMap);
    if (dataAttarctionForMap !== undefined) initMap(dataAttarctionForMap, dataGeomGtp)
  }, [dataAttarctionForMap, dataGeomGtp, userLocation])

  useEffect(() => {
    setShowLegendVisibility();
  }, [showLegend]);

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
      setUserLocation(newLocation);
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
    const selectedMarker = markerRefs.current[selectedAttractionId];

    if (map && selectedMarker !== null && selectedMarker !== undefined) {
      const markerPosition = selectedMarker.getPosition();

      if (markerPosition !== null && markerPosition !== undefined) {
        google.maps.event.trigger(selectedMarker, 'click');
        map.panTo(markerPosition);
      }
    }
  }, [selectedAttractionId])

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