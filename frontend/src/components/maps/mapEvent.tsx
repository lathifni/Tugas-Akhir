'use client'

import { fetchListVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"

export default function MapEvent() {

  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['listVillage'],
    queryFn: fetchListVillage,
  })

  const mapRef = React.useRef<HTMLDivElement>(null)
  const button1Ref = React.useRef<HTMLButtonElement>(null)
  const button2Ref = React.useRef<HTMLButtonElement>(null)
  const button3Ref = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps')

      const position = {
        lat: -0.7102134517843606,
        lng: 100.19420485758688
      }

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 16,
        mapId: 'myTA',
        mapTypeId: 'roadmap'
      }

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions)
      const digitasiVillage = new google.maps.Data()
      const infoWindow = new google.maps.InfoWindow();

      const rendereOptions = {
        map: map
      }

      // map.set('styles', customStyled);


      if (data && Array.isArray(data)) {
        data.forEach((item: { id: string, name: string, geom: string }) => {

          const id: string = item.id
          const name: string = item.name
          const geom: string = JSON.parse(item.geom)

          digitasiVillage.addGeoJson({
            type: 'Feature',
            properties: { id, name },
            geometry: geom
          })

          digitasiVillage.setStyle({
            fillColor: '#793FDF',
            strokeWeight: 0.5,
            strokeColor: '#ffffff',
            fillOpacity: 0.5,
            clickable: true
          })
          digitasiVillage.setMap(map)
        })
      }
      const directionRenderer = new google.maps.DirectionsRenderer(rendereOptions)

      new google.maps.Marker({
        map: map,
        position: position,
      })
    }

    const handleClick = (name: string) => {
      console.log(`${name} clicked!`);
      // Lakukan aksi lain yang diinginkan di sini
    };

    const refs = [button1Ref, button2Ref, button3Ref];
    const names = ['Button 1', 'Button 2', 'Button 3'];

    refs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.addEventListener('click', () => handleClick(names[index]));
      }
    });

    initMap()
    return () => {
      refs.forEach((ref, index) => {
        if (ref.current) {
          ref.current.removeEventListener('click', () => handleClick(names[index]));
        }
      });
    };
  }, [data])

  return (
    <div>
      <div style={{ height: '700px', width: '950px' }} ref={mapRef} className="text-slate-700">
      </div>
      <div>
        <button ref={button1Ref}>Button 1</button>
        <button ref={button2Ref}>Button 2</button>
        <button ref={button3Ref}>Button 3</button>
      </div>
    </div>
  )
}