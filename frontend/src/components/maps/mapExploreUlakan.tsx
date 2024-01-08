'use client'

import { fetchListGeomCulinary } from "@/app/(pages)/api/fetchers/culinary"
import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
let markerArray: { [key: string]: google.maps.Marker } = {};

interface UserLocation {
  lat: number;
  lng: number;
}

interface dataListGeom {
  id: string;
  name: string;
  address: string
}

interface MapExploreUlakanProps {
  userLocation: UserLocation | null;
  goToObjectId?: number | null;
  showMapForType: string | null;
  // dataMapforType: 
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

export default function MapExploreUlakan({ userLocation, goToObjectId, showMapForType }: MapExploreUlakanProps) {

  const someFunction = () => {
    console.log(showMapForType);
  };

  const queryMutiple = () => {
    const resUlakanVillage = useQuery({
      queryKey: ['ulakanVillage'],
      queryFn: fetchUlakanVillage,
    })
    const resGeomGtp = useQuery({
      queryKey: ['geomGtp'],
      queryFn: fetchGeomGtp
    })
    const resListGeomCulinary = useQuery({
      queryKey: ['listGeomCulinary'],
      queryFn: fetchListGeomCulinary,
    })
    return [resUlakanVillage, resGeomGtp, resListGeomCulinary]
  }

  const [
    { isLoading: loadingUlakanVillage, data: dataUlakanVillage },
    { isLoading: loadingGeomGtp, data: dataGeomGtp },
    { isLoading: loadingListGeomCulinary, data: dataListGeomCulinary }
  ] = queryMutiple()

  const mapRef = React.useRef<HTMLDivElement>(null)

  const initMap = async (dataUlakanVillage: any[], dataGeomGtp: any[]) => {
    const { Map } = await loader.importLibrary('maps')

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
        const name = item.name
        const geom = JSON.parse(item.geom)

        digitasiVillage.addGeoJson({
          type: 'Feature',
          properties: { name },
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
        const name = event.feature.getProperty('name');
        infoWindow.setContent(`Nagari ${name}`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {
      dataGeomGtp.forEach((item: { geom: string }) => {
        const geom: string = JSON.parse(item.geom)

        digitasiGtp.addGeoJson({
          type: 'Feature',
          // properties: { name: '' },
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
        // const name = event.feature.getProperty('name');
        infoWindow.setContent(`Green Talao Park`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }
  };

  useEffect(() => {
    if (map !== null && dataListGeomCulinary) {
      dataListGeomCulinary.forEach((item: { id: string, name: string, address: string, status: number, contact_person: string, lat: GLfloat, lng: GLfloat }) => {
        const { id, name, address, contact_person, lat, lng, status } = item;
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
          new google.maps.InfoWindow({
            content: `
            <h3>${name}</h3>
            <p>${address}</p>
            <p>${contact_person}</p>
            `
          })
        });
        markerArray[id] = marker
      });

      if (Object.keys(markerArray).length > 0) {
        const bounds = new google.maps.LatLngBounds();
        for (const i in markerArray) {
          const positionArray = markerArray[i].getPosition();
          // console.log(positionArray?.toString());

          if (positionArray) { // Periksa apakah position valid
            bounds.extend(positionArray);
          }
        }
        map.fitBounds(bounds);
      }
    }
  }, [map, dataListGeomCulinary])

  useEffect(() => {
    someFunction()
    if (map) {
      map.setZoom(5);
      dataListGeomCulinary.forEach((item: { id: string, name: string, address: string, status: number, contact_person: string, lat: GLfloat, lng: GLfloat }) => {
        const { id, name, address, contact_person, lat, lng, status } = item;
        const marker = new google.maps.Marker({
          map: map,
          position: { lat: lat, lng: lng },
          animation: google.maps.Animation.DROP,
          icon: status === 1 ? '/icon/cpgtp.png' : '/icon/culinary.png'
        });
        console.log('apakah ngaruh?');
        
        marker.addListener('click', () => {
          new google.maps.InfoWindow({
            content: `
                <h3>${name}</h3>
                <p>${address}</p>
                <p>${contact_person}</p>
              `
          }).open(map, marker);
          marker.setMap(map)
        });
        markerArray[id] = marker
      });
    }
  }, [showMapForType])


  useEffect(() => {
    initMap(dataUlakanVillage, dataGeomGtp);
  }, [queryMutiple()])

  return (
    <div style={{ height: '500px' }} ref={mapRef} className="text-slate-700"></div>
  )
}