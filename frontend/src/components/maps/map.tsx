'use client'

import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect, useState } from "react"
// import { pin.png } from '../../../public/pin.png'

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

      // fetch('http://localhost:3001')
      //   .then(response => response.json())
      //   .then(data => {
      //     if (data && data.data && Array.isArray(data.data)) {
      //       data.data.forEach((item: { id: string; name: string; geojson: string }) => {
      //         const id: string = item.id;
      //         const name: string = item.name;
      //         const geojson: any = JSON.parse(item.geojson);
      
      //         digitasiKotaKabupaten.addGeoJson({
      //           type: 'Feature',
      //           properties: { id, name },
      //           geometry: geojson
      //         });
      
      //         digitasiKotaKabupaten.setStyle({
      //           fillColor: '#F875AA',
      //           strokeWeight: 0.5,
      //           strokeColor: '#ffffff',
      //           fillOpacity: 0.5,
      //           clickable: true
      //         });
      //         digitasiKotaKabupaten.setMap(map);
      //       });
      //     } else {
      //       console.error('Data array is undefined or not an array.');
      //     }
      //   })
      //   .catch(error => console.error(error));

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

      // digitasiKotaKabupaten.addListener('click', function (event: google.maps.Data.MouseEvent) {
      //   const name = event.feature.getProperty('name');
      //   infoWindow.setContent(`Kota/Kabupaten ${name}`)

      //   infoWindow.setPosition(event.latLng);
      //   infoWindow.open(map);
      // });

      new google.maps.Marker({
        map: map,
        position: position,
      })
    }

    initMap()
  }, [])

  return (
    <div style={{ height: '700px' }} ref={mapRef} className="text-slate-700"></div>
  )
}