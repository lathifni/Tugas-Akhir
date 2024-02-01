'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchListGeomKec, fetchListGeomKotaKab } from "@/app/(pages)/api/fetchers/kotaKabKec"
import { fetchListVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { createRoot } from 'react-dom/client';
import { GtpInfoWindow, Legend } from "./mapHelper"

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapProps {
  userLocation: UserLocation | null;
  goToObject: boolean | false;
  setGoToObject: React.Dispatch<React.SetStateAction<boolean>>;
  showLegend: boolean | false;
}
let map: google.maps.Map | null = null;

export default function MapHomeCopy() {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const legendRef = React.useRef<HTMLDivElement>(null);

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly'
  })
  const position = {
    lat: -0.7102134517843606,
    lng: 100.19420485758688
  }

  const { data: kotaKabData, isLoading: loadingKotaKab } = useQuery({
    queryKey: ['kotaKab'],
    queryFn: fetchListGeomKotaKab
  })
  const { data: kecData, isLoading: loadingKec } = useQuery({
    queryKey: ['kec'],
    queryFn: fetchListGeomKec
  })
  const { data: villageData, isLoading: loadingVillage } = useQuery({
    queryKey: ['village'],
    queryFn: fetchListVillage
  })
  const { data: gtpData, isLoading: loadingGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })

  const initMap = async (kotaKabData: any[], kecData: any[], villageData: any[], gtpData: any[]) => {
    const { Map } = await loader.importLibrary('maps')
    window.google = google;
    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 6,
      // mapId: 'myTA'
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

    const infoWindow = new google.maps.InfoWindow();
    map = new Map(mapRef.current as HTMLDivElement, mapOptions)
    const digitasiGtp = new google.maps.Data()

    if (gtpData && Array.isArray(gtpData)) {
      gtpData.forEach((item: { geom: string }) => {
        const geom: string = JSON.parse(item.geom)

        digitasiGtp.addGeoJson({
          type: 'Feature',
          geometry: geom
        })
        digitasiGtp.setStyle({
          fillColor: '#03C988',
          strokeWeight: 3,
          strokeColor: '#ffffff',
          fillOpacity: 2,
          clickable: false
        })
        digitasiGtp.setMap(map)
      });
    }

    const markerGTP = new google.maps.Marker({
      map: map,
      position: position,
      icon: '/icon/gtp.png',
      animation: google.maps.Animation.DROP,
    })
    const container = document.createElement('div');

    const gtpInfoWindow = new google.maps.InfoWindow()
    markerGTP.addListener('click', function (event: google.maps.MapMouseEvent) {
      const root = createRoot(container);
      root.render(<GtpInfoWindow />)
      gtpInfoWindow.setContent(container)
      gtpInfoWindow.open(map, markerGTP);
    })
  }

  // const navigateToObject = () => {
  //   if (map) {
  //     const object: google.maps.LatLngLiteral = position
  //     map.panTo(object);
  //     map.setZoom(13);
  //     setGoToObject(false)
  //   }
  //   setGoToObject(false)
  // }

  useEffect(() => {
    initMap(kotaKabData, kecData, villageData, gtpData)
  }, [kotaKabData, kecData, villageData, gtpData])

  // useEffect(() => {
  //   if (userLocation !== null && map) {
  //     const marker = new google.maps.Marker()
  //     const markerOptions = {
  //       position: userLocation,
  //       map: map,
  //       animation: google.maps.Animation.DROP,
  //     }
  //     marker.setOptions(markerOptions)
  //     marker.setMap
  //     const infoWindow = new google.maps.InfoWindow({
  //       content: `<p>You Are Here</p>`
  //     });
  //     marker.addListener('click', () => {
  //       infoWindow.open(map, marker);
  //     });
  //     infoWindow.open(map, marker);
  //     map.panTo(userLocation);
  //   }
  // }, [userLocation])

  // useEffect(() => {
  //   if (goToObject) {
  //     navigateToObject();
  //   }
  // }, [goToObject])

  // useEffect(() => {
  //   setShowLegendVisibility();
  // }, [showLegend]);

  // const setShowLegendVisibility = () => {
  //   if (legendRef.current) {
  //     const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
  //     if (legendContent) {
  //       legendContent.style.display = showLegend ? 'block' : 'none';
  //     }
  //   }
  // };

  return (
    <div className="relative">
      {/* <div ref={legendRef} className={`absolute bottom-6 left-2 `} style={{ zIndex: 100 }}>
        {showLegend && (
          <div className="legend-content" style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
            <Legend />
          </div>
        )}
      </div> */}
      <div ref={mapRef} className="text-slate-700 h-[500px] md:h-[700px] rounded-lg"></div>
    </div>
  )
}