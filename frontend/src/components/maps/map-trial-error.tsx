'use client'

import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect, useState } from "react"

export default function MapTrialError() {
  const mapRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary
      // const map = new Map(mapRef.current as HTMLDivElement)

      const position = {
        lat: -0.7102134517843606,
        lng: 100.19420485758688
      }

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 6,
        mapId: 'myTA'
      }

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

      const infoWindow = new google.maps.InfoWindow({
        content: "terstttttt",
        disableAutoPan: true,
      });

      const marker = new google.maps.Marker({
        position: position,
        map,
        title: "Uluru (Ayers Rock)",
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
      });



      // const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

      const provinsiGeojsons = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09']

    }

    initMap()
  }, [])

  return (
    <div style={{ height: '700px', width: '950px' }} ref={mapRef}></div>
  )
}