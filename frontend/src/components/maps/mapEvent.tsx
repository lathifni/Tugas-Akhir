'use client'

import { fetchListEvent } from "@/app/(pages)/api/fetchers/event"
import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { createRoot } from 'react-dom/client';
import { Legend, MapContentEvent } from "./mapHelper"

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapEventProps {
  userLocation: UserLocation | null;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  isManualLocation: boolean;
  setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showLegend: boolean | false;
  selectedEventId: string;
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

export default function MapEvent({ selectedEventId, userLocation, setUserLocation, isManualLocation, setIsManualLocation, showLegend }: MapEventProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let markerRefs = useRef<{ [id: string]: google.maps.Marker | null }>({});
  const legendRef = React.useRef<HTMLDivElement>(null);

  const { data: dataEvent, isLoading: loadingEvent } = useQuery({
    queryKey: ['listEvent'],
    queryFn: fetchListEvent,
  })
  const { data: dataGeomGtp, isLoading: loadingGeomGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })

  const initMap = async (dataEvent: any[], dataGeomGtp: any[]) => {
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
    if (dataEvent && Array.isArray(dataEvent)) {
      dataEvent.forEach((item: { id: string, name: string, type: string, price: number, lat: number, lng: number }) => {
        const marker = new google.maps.Marker()
        const { id, name, type, price, lat, lng } = item
        const markerOptions = {
          map: map,
          position: { lat, lng },
          title: name,
          animation: google.maps.Animation.DROP,
          icon: '/icon/event.png',
        }
        marker.setOptions(markerOptions)

        const rupiah = (number: number) => {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(number);
        }

        // markers[id] = marker
        markerRefs.current[id] = marker
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE)
          setTimeout(() => {
            marker.setAnimation(null)
          }, 1700)
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentEvent id={id} name={name} type={type} price={price} />)
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
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
    initMap(dataEvent, dataGeomGtp)
  }, [dataEvent, dataGeomGtp])

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
    const selectedMarker = markerRefs.current[selectedEventId];

    if (map && selectedMarker !== null && selectedMarker !== undefined) {
      const markerPosition = selectedMarker.getPosition();

      if (markerPosition !== null && markerPosition !== undefined) {
        google.maps.event.trigger(selectedMarker, 'click');
        map.panTo(markerPosition);
      }
    }
  }, [selectedEventId])

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