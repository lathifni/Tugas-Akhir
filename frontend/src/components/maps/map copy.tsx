'use client'

import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect, useState } from "react"

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps')
      // const { Data } = await loader.importLibrary("maps")

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
      const infoWindow = new google.maps.InfoWindow();
      const digitasiProvinsi = new google.maps.Data()
      const digitasiNegara = new google.maps.Data()
      const digitasiKotaKabupaten = new google.maps.Data()

      const negaraGeoJsons = ['N01', 'N02']
      const provinsiGeojsons = ['P01', 'P02', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09']

      for (const negaraGeoJson of negaraGeoJsons) {
        fetch(`maps/${negaraGeoJson}.geojson`)
          .then(response => response.json())
          .then(data => {
            digitasiNegara.addGeoJson(data)
            digitasiNegara.setStyle({
              fillColor: '#793FDF',
              strokeWeight: 0.5,
              strokeColor: '#ffffff',
              fillOpacity: 0.5,
              clickable: true
            })
            digitasiNegara.setMap(map)
          })
          .catch(error => console.error(error))
      }

      for (const provinsiGeojson of provinsiGeojsons) {
        fetch(`maps/${provinsiGeojson}.geojson`)
          .then(response => response.json())
          .then(data => {
            digitasiProvinsi.addGeoJson(data)
            digitasiProvinsi.setStyle({
              fillColor: '#35A29F',
              strokeWeight: 0.5,
              strokeColor: '#ffffff',
              fillOpacity: 0.5,
              clickable: true
            })
            digitasiProvinsi.setMap(map)
          })
          .catch(error => console.error(error))
      }

      digitasiProvinsi.addListener('click', function (event: google.maps.Data.MouseEvent) {
        const name = event.feature.getProperty('name');
        infoWindow.setContent(`Provinsi ${name}`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      digitasiNegara.addListener('click', function (event: google.maps.Data.MouseEvent) {
        const name = event.feature.getProperty('name');
        infoWindow.setContent(`Negara ${name}`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      new google.maps.Marker({
        map: map,
        position: position,
      })
    }
    initMap()
  }, [])

  return (
    <div style={{ height: '700px', width: '950px' }} ref={mapRef} className="text-slate-700"></div>
  )
}