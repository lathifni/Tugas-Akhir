'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp";
import { Loader } from "@googlemaps/js-api-loader";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react"

interface MapDetailProps {
  geomObject: object,
  lat: number;
  lng: number;
  name: string;
  icon: string;
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

export default function MapDetail({ geomObject, lat, lng, name, icon }:MapDetailProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  const { data: dataGeomGtp, isLoading: loadingGeomGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })
  
  const initMap = async (dataGeomGtp: any[], geomObject: object) => {    
    const { Map } = await loader.importLibrary('maps')
    window.google = google;

    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 15,
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
    const bounds = new google.maps.LatLngBounds()
    const digitasiVillage = new google.maps.Data()
    const digitasiObject = new google.maps.Data()
    
    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {      
      dataGeomGtp.forEach((item: { id: string, name: string, geom: string }) => {
        const { id, name } = item
        const geom: string = item.geom

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
    if (geomObject !== undefined && geomObject !== null) {
      digitasiObject.addGeoJson({
        type: 'Feature',
        // properties: { id:1, name:'name' },
        geometry: geomObject
      })
      digitasiObject.setStyle({
        fillColor: '#32CD32',
        strokeWeight: 0.5,
        strokeColor: '#ffffff',
        fillOpacity: 0.5,
        clickable: true
      })
      digitasiObject.forEach((feature) => {
        const geometry = feature.getGeometry();
        if (geometry) {
          geometry.forEachLatLng((latLng: google.maps.LatLng) => {
            bounds.extend(latLng);
          });
        }
      });
      digitasiObject.setMap(map)
      map.fitBounds(bounds)      

      const infoWindow = new google.maps.InfoWindow();

    // Listener untuk event 'click' pada digitasiObject
    digitasiObject.addListener('click', (event: google.maps.Data.MouseEvent) => {
      // Setel konten InfoWindow dengan informasi dari properti
      infoWindow.setContent(name);

      // Tampilkan InfoWindow di lokasi klik
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });

      // Add a marker at the centroid
      const marker = new google.maps.Marker()
      const markerOptions = {
        map: map,
        position: { lat, lng },
        title: "Centroid Marker",
        animation: google.maps.Animation.DROP,
        icon: `/icon/${icon}`
      }
      marker.setOptions(markerOptions)
      marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // Setel animasi kembali ke null setelah 1.7 detik
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1700);
      });
    }
  }

  useEffect(() => {
    if (dataGeomGtp && geomObject) {
      initMap(dataGeomGtp, geomObject)
    }
  }, [dataGeomGtp, geomObject])  
  
  return (
    <div className="relative">
      <div ref={mapRef} className="text-slate-700 h-[400px] md:h-[400px] rounded-lg"></div>
    </div>
  )
}