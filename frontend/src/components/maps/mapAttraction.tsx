'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { createRoot } from 'react-dom/client';
import { Legend } from "./mapHelper";
import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp";
import { fetchListGeomHomestay } from "@/app/(pages)/api/fetchers/homestay";
import { fetchGeomEstuary, fetchGeomMakam, fetchGeomTracking, fetchGeomTrip } from "@/app/(pages)/api/fetchers/attraction";

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
  eventId: string;
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

export default function mapAttraction({ eventId, userLocation, setUserLocation, isManualLocation, setIsManualLocation, showLegend }:MapAttractionProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let markerRefs = useRef<{ [id: string]: google.maps.Marker | null }>({});
  const legendRef = React.useRef<HTMLDivElement>(null);
  let dataAttarctionForMap: any

  if (eventId === 'A0001') {
    const { data: dataGeomTracking, isLoading: loadingListaGeomHomestay } = useQuery({
      queryKey: ['geomTracking'],
      queryFn: fetchGeomTracking
    })
    dataAttarctionForMap = dataGeomTracking
  } else if (eventId === 'A0004') {
    const { data: dataGeomEstuary, isLoading: loadingListaGeomHomestay } = useQuery({
      queryKey: ['geomEstuary'],
      queryFn: fetchGeomEstuary
    })
    dataAttarctionForMap = dataGeomEstuary
  } else if (eventId === 'A0005') {
    const { data: dataGeomTrip, isLoading: loadingListaGeomHomestay } = useQuery({
      queryKey: ['geomTrip'],
      queryFn: fetchGeomTrip
    })
    dataAttarctionForMap = dataGeomTrip
  } else if (eventId === 'A0006') {
    const { data: dataGeomMakam, isLoading: loadingListaGeomHomestay } = useQuery({
      queryKey: ['geomMakam'],
      queryFn: fetchGeomMakam
    })
    dataAttarctionForMap = dataGeomMakam
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
          icon: '/icon/tracking.png',
        }
        marker.setOptions(markerOptions)

        markerRefs.current[id] = marker
        // marker.addListener('click', () => {
        //   marker.setAnimation(google.maps.Animation.BOUNCE)
        //   setTimeout(() => {
        //     marker.setAnimation(null)
        //   }, 1700)
        //   const container = document.createElement('div');
        //   const root = createRoot(container);
        //   root.render(<MapContentHomestayPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />)
        //   infoWindow.open(map, marker);
        //   new google.maps.InfoWindow({
        //     content: document.body.appendChild(container)
        //   }).open(map, marker)
        // });
        markerArray[id] = marker
        digitasiEstuary.addGeoJson({
          type: 'Feature',
          geometry: geom
        })
        digitasiEstuary.setStyle({
          fillColor: '#FF0000',
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