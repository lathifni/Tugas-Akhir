'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchListGeomKec, fetchListGeomKotaKab } from "@/app/(pages)/api/fetchers/kotaKabKec"
import { fetchListVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
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

export default function MapHome({ userLocation, goToObject, setGoToObject, showLegend }: MapProps) {
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
    queryFn: fetchListGeomKotaKab,
    refetchOnWindowFocus: false
  })
  const { data: kecData, isLoading: loadingKec } = useQuery({
    queryKey: ['kec'],
    queryFn: fetchListGeomKec,
    refetchOnWindowFocus: false
  })
  const { data: villageData, isLoading: loadingVillage } = useQuery({
    queryKey: ['village'],
    queryFn: fetchListVillage,
    refetchOnWindowFocus: false
  })
  const { data: gtpData, isLoading: loadingGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp,
    refetchOnWindowFocus: false
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
    const digitasiProvinsi = new google.maps.Data()
    const digitasiNegara = new google.maps.Data()
    const digitasiKotaKabupaten = new google.maps.Data()
    const digitasiKecamatan = new google.maps.Data()
    const digitasiVillage = new google.maps.Data()
    const digitasiGtp = new google.maps.Data()

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
    
    if (kotaKabData && Array.isArray(kotaKabData)) {
      kotaKabData.forEach((item: { id: string, name: string, geom: string }) => {
        const geom = item.geom;
        
        const { id, name } = item

        digitasiKotaKabupaten.addGeoJson({
          type: 'Feature',
          properties: { id, name },
          geometry: geom
        })

        digitasiKotaKabupaten.setStyle({
          fillColor: '#F875AA',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiKotaKabupaten.setMap(map)
      });
    }
    
    if (kecData && Array.isArray(kecData)) {
      kecData.forEach((item: { id: string, name: string, geom: string }) => {
        const geom = item.geom;
        const { id, name } = item

        digitasiKecamatan.addGeoJson({
          type: 'Feature',
          properties: { id, name },
          geometry: geom
        })
        digitasiKecamatan.setStyle({
          fillColor: '#F0FF42',
          strokeWeight: 0.4,
          strokeColor: '#ffffff',
          fillOpacity: 0.4,
          clickable: true
        })
        digitasiKecamatan.setMap(map)
      });
    }

    if (villageData && Array.isArray(villageData)) {
      villageData.forEach((item: { id: string, name: string, geom: string }) => {
        const geom = item.geom;
        const { id, name } = item

        digitasiVillage.addGeoJson({
          type: 'Feature',
          properties: { id, name },
          geometry: geom
        })
        digitasiVillage.setStyle({
          fillColor: '#FFC436',
          strokeWeight: 2,
          strokeColor: '#ffffff',
          fillOpacity: 2,
          clickable: true
        })
        digitasiVillage.setMap(map)
      });
    }

    if (gtpData && Array.isArray(gtpData)) {
      gtpData.forEach((item: { geom: string }) => {
        const geom = item.geom;

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

    digitasiNegara.addListener('click', function (event: google.maps.Data.MouseEvent) {
      const name = event.feature.getProperty('name');
      infoWindow.setContent(`Negara ${name}`)

      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });

    digitasiProvinsi.addListener('click', function (event: google.maps.Data.MouseEvent) {
      const name = event.feature.getProperty('name');
      infoWindow.setContent(`Provinsi ${name}`)

      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });

    digitasiKotaKabupaten.addListener('click', function (event: google.maps.Data.MouseEvent) {
      const name = event.feature.getProperty('name');
      infoWindow.setContent(`${name}, Sumatera Barat`)
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    })

    digitasiKecamatan.addListener('click', function (event: google.maps.Data.MouseEvent) {
      const name = event.feature.getProperty('name');
      infoWindow.setContent(`Kecamatan ${name}`)
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    })

    digitasiVillage.addListener('click', function (event: google.maps.Data.MouseEvent) {
      const name = event.feature.getProperty('name');
      infoWindow.setContent(`Kecamatan ${name}`)
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    })

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

  const navigateToObject = () => {
    if (map) {
      const object: google.maps.LatLngLiteral = position
      map.panTo(object);
      map.setZoom(13);
      setGoToObject(false)
    }
    setGoToObject(false)
  }

  useEffect(() => {
    initMap(kotaKabData, kecData, villageData, gtpData)
  }, [kotaKabData, kecData, villageData, gtpData])

  useEffect(() => {
    if (userLocation !== null && map) {
      const marker = new google.maps.Marker()
      const markerOptions = {
        position: userLocation,
        map: map,
        animation: google.maps.Animation.DROP,
      }
      marker.setOptions(markerOptions)
      marker.setMap
      const infoWindow = new google.maps.InfoWindow({
        content: `<p>You Are Here</p>`
      });
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      infoWindow.open(map, marker);
      map.panTo(userLocation);
    }
  }, [userLocation])

  useEffect(() => {
    if (goToObject) {
      navigateToObject();
    }
  }, [goToObject])

  useEffect(() => {
    setShowLegendVisibility();
  }, [showLegend]);

  const setShowLegendVisibility = () => {
    if (legendRef.current) {
      const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
      if (legendContent) {
        legendContent.style.display = showLegend ? 'block' : 'none';
      }
    }
  };

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