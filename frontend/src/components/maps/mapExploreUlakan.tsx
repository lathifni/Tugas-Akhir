'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
let markerArray: any = {};

interface UserLocation {
  lat: number;
  lng: number;
}

interface dataListGeom {
  id: string;
  name: string;
  address: string
  contact_person: string | null;
  capacity: number | null;
  status: number | null;
  lat: number;
  lng: number;
}

interface MapExploreUlakanProps {
  userLocation: UserLocation | null;
  goToObjectId?: number | null;
  showMapForType: string | null;
  dataMapforType: dataListGeom[] | null
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

export default function MapExploreUlakan({ userLocation, goToObjectId, showMapForType, dataMapforType }: MapExploreUlakanProps) {
  const queryMutiple = () => {
    const resUlakanVillage = useQuery({
      queryKey: ['ulakanVillage'],
      queryFn: fetchUlakanVillage,
    })
    const resGeomGtp = useQuery({
      queryKey: ['geomGtp'],
      queryFn: fetchGeomGtp
    })
    return [resUlakanVillage, resGeomGtp]
  }

  const [
    { isLoading: loadingUlakanVillage, data: dataUlakanVillage },
    { isLoading: loadingGeomGtp, data: dataGeomGtp }
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
        // const name = item.name
        const geom = JSON.parse(item.geom)

        digitasiVillage.addGeoJson({
          type: 'Feature',
          // properties: { name },
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
        // const name = event.feature.getProperty('name');
        infoWindow.setContent(`Nagari Ulakan`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {
      dataGeomGtp.forEach((item: { geom: string }) => {
        const geom: string = JSON.parse(item.geom)

        digitasiGtp.addGeoJson({
          type: 'Feature',
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
        infoWindow.setContent(`Green Talao Park`)

        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    if (dataMapforType !== null) {
      const firstIdData = dataMapforType[0].id
      if (firstIdData.startsWith("CP")) {
        dataMapforType.forEach((item: dataListGeom) => {
          const { id, name, address, contact_person, status, lat, lng } = item
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
            }).open(map,marker)
          });
          markerArray[id] = marker
        })
      } else if (firstIdData.startsWith('WP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          const { id, name, address, capacity, lat, lng } = item
          const pos = new google.maps.LatLng(lat, lng)
          const marker = new google.maps.Marker();
  
          const markerOptions = {
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: '/icon/worship.png'
          }
          marker.setOptions(markerOptions)
          marker.addListener('click', () => {
            new google.maps.InfoWindow({
              content: `
              <h3>${name}</h3>
              <p>${address}</p>
              <p>${capacity}</p>
              `
            }).open(map,marker)
          });
          markerArray[id] = marker
        })
      } else if (firstIdData.startsWith('SP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          const { id, name, address, contact_person, status, lat, lng } = item
          const pos = new google.maps.LatLng(lat, lng)
          const marker = new google.maps.Marker();
  
          const markerOptions = {
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: '/icon/souvenir.png'
          }
          marker.setOptions(markerOptions)
          marker.addListener('click', () => {
            new google.maps.InfoWindow({
              content: `
              <h3>${name}</h3>
              <p>${address}</p>
              <p>${contact_person}</p>
              `
            }).open(map,marker)
          });
          markerArray[id] = marker
        })
      } else {
        dataMapforType.forEach((item: dataListGeom) => {
          const { id, name, address, contact_person, lat, lng } = item
          const pos = new google.maps.LatLng(lat, lng)
          const marker = new google.maps.Marker();
  
          const markerOptions = {
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: '/icon/homestay.png'
          }
          marker.setOptions(markerOptions)
          marker.addListener('click', () => {
            new google.maps.InfoWindow({
              content: `
              <h3>${name}</h3>
              <p>${address}</p>
              <p>${contact_person}</p>
              `
            }).open(map,marker)
          });
          markerArray[id] = marker
        })
      }
    }
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
  };

  useEffect(() => {
    initMap(dataUlakanVillage, dataGeomGtp);
  }, [queryMutiple(), dataMapforType])

  return (
    <div style={{ height: '500px' }} ref={mapRef} className="text-slate-700"></div>
  )
}