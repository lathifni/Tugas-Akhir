'use client'

import { fetchListEvent } from "@/app/(pages)/api/fetchers/event"
import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { icon } from "@fortawesome/fontawesome-svg-core"
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import '@fortawesome/fontawesome-svg-core/styles.css';

interface EventData {
  id: string;
  name: string;
  type: string;
  price: number;
  lat: number;
  lng: number;
}

interface MapEventProps {
  // events: EventData[];
  selectedEventId: string;
}

export default function MapEvent({ selectedEventId }: MapEventProps) {
  const markerInfoWindows: { [key: string]: google.maps.InfoWindow } = {};
  let markers: any = {}
  let map: google.maps.Map | null = null;

  const queryMutiple = () => {
    const resEvent = useQuery({
      queryKey: ['listEvent'],
      queryFn: fetchListEvent,
    })
    const dataGeomGtp = useQuery({
      queryKey: ['geomGtp'],
      queryFn: fetchGeomGtp
    })
    return [resEvent, dataGeomGtp]
  }

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
    const infoWindow = new google.maps.InfoWindow();

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
        const { id, name, type, price, lat, lng } = item
        const markerOptions = {
          map: map,
          position: { lat, lng },
          title: name,
          animation: google.maps.Animation.DROP,
          icon: '/icon/event.png',
        }
        const marker = new google.maps.Marker()
        marker.setOptions(markerOptions)

        const rupiah = (number: number) => {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(number);
        }

        const infoWindow = new google.maps.InfoWindow({
          content: `<div >
          <p style="font-weight: bold; margin:5px; font-size: 18px;">${name}</p>
          <p style="display: flex; justify-content: center; align-items: center; margin: 10px;"><img src="/icon/spa-solid.svg" alt="yearly event" style="margin-right: 5px;"/>${type}</p>
          <p style="display: flex; justify-content: center; align-items: center; margin: 10px;"><img src="/icon/money-bill-wave-solid.svg" alt="insert" style="margin-right: 5px;"/>${rupiah(price)}</p>
          <br>
          <div style="display: flex; justify-content: center; align-items: center; margin: 5px; font-weight: bold;">
          <a title="Info" target="_blank" id="infoInfoWindow" href='/explore/event/${id}'><img src="/icon/magnifying-glass-solid.svg" alt="detail"/>info</a>
          </div>
          </div>
          `
        });

        markers[id] = marker
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }

    if (selectedEventId) {
      google.maps.event.trigger(markers[selectedEventId], 'click')
      map.panTo(markers[selectedEventId].getPosition())
    }
  }

  const [
    { isLoading: loadingEvent, data: dataEvent },
    { isLoading: loadingGeomGtp, data: dataGeomGtp }
  ] = queryMutiple()

  const mapRef = React.useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   if (map !== null) {
  //     google.maps.event.trigger(markers[selectedEventId], 'click')
  //     map.panTo(markers[selectedEventId].getPosition())
  //   }
  // }, [selectedEventId])

  useEffect(() => {
    initMap()
  }, [queryMutiple(), selectedEventId])

  return (
    <div style={{ height: '700px', }} ref={mapRef} className="text-slate-700"></div>
  )
}