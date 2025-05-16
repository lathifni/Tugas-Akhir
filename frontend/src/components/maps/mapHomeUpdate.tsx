'use client'

import { fetchGeomGtp, fetchListAllObject } from "@/app/(pages)/api/fetchers/gtp"
import { fetchEstuaryGeom, fetchListVillage, fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import useAxiosAuth from "../../../libs/useAxiosAuth"
import { MapContentCulinaryPlaces, MapContentWorshipPlaces, MapContentSouvenirPlaces, MapContentHomestayPlaces, Legend, MapContentGeneral, MapContentAttraction, GtpInfoWindow, MapContentBrowseCulinaryPlaces, MapContentBrowseWorshipPlaces, MapContentBrowseSouvenirPlaces, MapContentBrowseHomestayPlaces } from "./mapHelper"
import { createRoot } from 'react-dom/client';
import { fetchListGeomKec, fetchListGeomKotaKab } from "@/app/(pages)/api/fetchers/kotaKabKec"
import { boolean } from "zod"

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapType {
  culinaryPlaces: boolean;
  homestay: boolean;
  souvenirPlaces: boolean;
  worshipPlaces: boolean;
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
  dataMapforType: dataListGeom[] | null
  radius?: number | null;
  objectAround: MapType | null;
  isManualLocation: boolean;
  setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  distances: number[];
  instructions: string[];
  setDistances: React.Dispatch<React.SetStateAction<number[]>>;
  setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
  showLegend: boolean | false;
  dayActivities: any[]
  traffic: boolean | false ;
  browsePlace: boolean | false;
  object: {
    attraction: boolean;
    worshipPlace: boolean;
    culinaryPlace: boolean;
    homestay: boolean;
    souvenirPlace: boolean;
  };
  visibility: {
    country: boolean;
    province: boolean;
    cityRegency: boolean;
    district: boolean;
    village: boolean;
    // stepsInformation: boolean
  };
  reachToObject: boolean | false ;
  selectActivities: { start:any; end:any } | null;
  goToObject: boolean | false;
  setGoToObject: React.Dispatch<React.SetStateAction<boolean>>;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  showTerrain: boolean;
  setShowTerrain: (value: boolean) => void;
  setBrowseId: React.Dispatch<React.SetStateAction<string | null>>;
  setBrowseName: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface Step {
  distance?: {
    value?: number;
  };
  instructions?: string;
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
let markerArray: any = {};
let routeArray: any = [];

export default function MapHomeUpdate({
  userLocation, dataMapforType, radius, isManualLocation, setIsManualLocation, setUserLocation
  , objectAround, distances, setDistances, instructions, setInstructions, showLegend
  , dayActivities, selectActivities, traffic, visibility, reachToObject, object
  , goToObject, setGoToObject, showLabels, setShowLabels, showTerrain, setShowTerrain
  , browsePlace, setBrowseId, setBrowseName,
}: MapExploreUlakanProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const legendRef = React.useRef<HTMLDivElement>(null);
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let circleRef = useRef<google.maps.Circle | null>(null);
  const routeRenderersRef = useRef<google.maps.DirectionsRenderer[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

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
  
  const { data: dataUlakanVillage, isLoading: loadingUlakanVillage } = useQuery({
    queryKey: ['ulakanVillage'],
    queryFn: fetchUlakanVillage,
  })
  const { data: dataGeomGtp, isLoading: loadingGeomGtp } = useQuery({
    queryKey: ['geomGtp'],
    queryFn: fetchGeomGtp
  })
  const { data: dataListAllObject, isLoading: loadingListAllObject } = useQuery({
    queryKey: ['listAllObject'],
    queryFn: () => fetchListAllObject()
  })
  const { data: geomEstuary, isLoading: loadingEstuary } = useQuery({
      queryKey: ['geomEstuary'],
      queryFn: fetchEstuaryGeom
  }) 

  const initMap = async (kotaKabData: any[], kecData: any[], villageData: any[], gtpData: any[]) => {
    const { Map } = await loader.importLibrary('maps')
    window.google = google;
    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 6,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
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
    const digitasiObject = new google.maps.Data()
    const bounds = new google.maps.LatLngBounds()
    const digitasiProvinsi = new google.maps.Data()
    const digitasiNegara = new google.maps.Data()
    const negaraLayers: Record<string, google.maps.Data> = {};
    const digitasiKotaKabupaten = new google.maps.Data()
    const digitasiKecamatan = new google.maps.Data()
    const digitasiVillage = new google.maps.Data()
    const digitasiGtp = new google.maps.Data()
    const negaraGeoJsons = ['N01', 'N02', 'N03', 'N06']
    // const negaraGeoJsons = ['N01', 'N02', 'N03', 'N04']
    const warnaNegara: Record<string, string> = {
      N01: '#793FDF', // Warna untuk N01
      N02: '#03C988', // Warna untuk N02
      N03: '#FF5733', // Warna untuk N03
      N06: '#FFC300', // Warna untuk N06
    };
    const provinsiGeojsons = ['P01', 'P02','P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10']

    // if (visibility.country) {
    //   for (const negaraGeoJson of negaraGeoJsons) {
    //     fetch(`maps/${negaraGeoJson}.geojson`)
    //       .then(response => response.json())
    //       .then(data => {
    //         digitasiNegara.addGeoJson(data)
    //         digitasiNegara.setStyle({
    //           fillColor: '#793FDF',
    //           strokeWeight: 0.5,
    //           strokeColor: '#ffffff',
    //           fillOpacity: 0.5,
    //           clickable: true,
    //           zIndex: 1
    //         })
    //         digitasiNegara.setMap(map)
    //       })
    //       .catch(error => console.error(error))
    //   }
      
    // //   fetch('maps/N05.geojson')
    // // .then(response => response.json())
    // // .then(data => {
    // //   digitasiGtp.addGeoJson(data); // Menambahkan GeoJSON ke peta

    // //   digitasiGtp.setStyle({
    // //     fillColor: '#03C988', // Ganti warna sesuai kebutuhan
    // //     strokeWeight: 3,
    // //     strokeColor: '#ffffff',
    // //     fillOpacity: 0.5, // Atur transparansi sesuai kebutuhan
    // //     clickable: false
    // //   });

    // //   digitasiGtp.setMap(map); // Menampilkan di peta

    // //   // Menambahkan label langsung di peta
    // //   const textLabel = new google.maps.Marker({
    // //     position: { lat: 1.277968756621077, lng: 103.843894137210782 }, // Posisi label (sesuaikan dengan koordinat dari GeoJSON)
    // //     map: map,
    // //     title: 'Steps to reach Ulakan village'
    // //   });
      
    // //   const infoWindow = new google.maps.InfoWindow({
    // //     content: '<div style="font-size: 14px; font-weight: bold;">' +
    // //              '1. Fly to Malaysia.<br>' +
    // //              '2. Take a flight to Padang city, Indonesia.<br>' +
    // //              '3. Rent a car or take a taxi to Nagari Ulakan village.' +
    // //              '</div>'
    // //   });
      
    // //   infoWindow.open(map, textLabel);
    // // })
    // // .catch(error => console.error('Error loading GeoJSON:', error));
    // }
    if (visibility.country) {
      for (const negaraGeoJson of negaraGeoJsons) {
        fetch(`maps/${negaraGeoJson}.geojson`)
          .then((response) => response.json())
          .then((data) => {
            // Buat instance baru untuk setiap negara
            const geoJsonLayer = new google.maps.Data();
    
            geoJsonLayer.addGeoJson(data);
    
            const fillColor = warnaNegara[negaraGeoJson] || '#793FDF';    
            geoJsonLayer.setStyle({
              fillColor: fillColor,
              strokeWeight: 0.6,
              strokeColor: '#ffffff',
              fillOpacity: 0.3,
              clickable: true,
              zIndex: 1,
            });
    
            geoJsonLayer.setMap(map); // Tampilkan layer di peta
    
            // Simpan instance layer ke objek negaraLayers
            negaraLayers[negaraGeoJson] = geoJsonLayer;
    
            // Tambahkan listener untuk layer ini
            geoJsonLayer.addListener('click', (event:google.maps.Data.MouseEvent) => {
              const name = event.feature.getProperty('name');
              infoWindow.setContent(`Country ${name}`)

              infoWindow.setPosition(event.latLng);
              infoWindow.open(map);
            });
          })
          .catch((error) => console.error(`Error loading ${negaraGeoJson}:`, error));
      }
    }

    if (visibility.province) {
      for (const provinsiGeojson of provinsiGeojsons) {
        fetch(`maps/${provinsiGeojson}.geojson`)
          .then(response => response.json())
          .then(data => {
            digitasiProvinsi.addGeoJson(data)
            digitasiProvinsi.setStyle({
              // fillColor: '#35A29F',
              fillColor: '#ffffff',
              strokeWeight: 0.5,
              strokeColor: '#ffffff',
              fillOpacity: 0.05,
              clickable: true,
              zIndex: 2
            })
            digitasiProvinsi.setMap(map)
          })
          .catch(error => console.error(error))
      }
    }
    
    if (visibility.cityRegency) {
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
            // fillColor: '#F875AA',
            fillColor: '#ffffff',
            strokeWeight: 0.5,
            strokeColor: '#ffffff',
            // fillOpacity: 0.5,
            fillOpacity: 0.05,
            clickable: true,
            zIndex: 3
          })
          digitasiKotaKabupaten.setMap(map)
        });
      }
    }
    
    if (visibility.district) {
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
            // fillColor: '#F0FF42',
            fillColor: '#ffffff',
            strokeWeight: 0.4,
            strokeColor: '#ffffff',
            // fillOpacity: 0.4,
            fillOpacity: 0.05,
            clickable: true,
            zIndex: 4
          })
          digitasiKecamatan.setMap(map)
        });
      }
    }

    if (visibility.village) {
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
            fillColor: '#ffffff',
            strokeWeight: 0.5,
            strokeColor: '#ffffff',
            fillOpacity: 0.05,
            clickable: true,
            zIndex: 5
          })
          digitasiVillage.setMap(map)
        });
      }
    }

    if (reachToObject) {
      const singapore = { lat: 1.2854190117401771, lng: 103.8198 };  // Koordinat Singapura
      const malaysia = { lat: 3.1503614007038454, lng: 101.97940881384584 }
      const jakarta = { lat: -6.204170461185947, lng: 106.82277186754867}
      const padang = { lat: -0.9478502987473912, lng: 100.3628232695202 };   // Koordinat Padang
      const bandaAceh = { lat: 5.537368838813003, lng: 95.50780215398227 }
      const nagariUlakan = { lat: -0.7099552023563865, lng: 100.19707985940916 };

      const markerMalaysia = new google.maps.Marker({
        position: malaysia,
        map: map,
        icon: {
          url: '/icon/malaysia.png',  // Path to your PNG icon
          scaledSize: new google.maps.Size(50, 50), // Set the size to your desired width and height
        },
        title: 'Malaysia',
        animation: google.maps.Animation.DROP,
        zIndex:1
        // icon: location.icon,
      });

      const markerSingapura = new google.maps.Marker({
        position: singapore,
        map: map,
        icon: {
          url: '/icon/singapore.png',  // Path to your PNG icon
          scaledSize: new google.maps.Size(50, 50), // Set the size to your desired width and height
        },
        title: 'Singapore',
        animation: google.maps.Animation.DROP,
        zIndex:1
        // icon: location.icon,
      });

      const markerJakarta = new google.maps.Marker({
        position: jakarta,
        map: map,
        icon: {
          url: '/icon/indonesia.png',  // Path to your PNG icon
          scaledSize: new google.maps.Size(50, 50), // Set the size to your desired width and height
        },
        title: 'Jakarta',
        animation: google.maps.Animation.DROP,
        zIndex:1
        // icon: location.icon,
      });

      const markerPadang = new google.maps.Marker({
        position: padang,
        map: map,
        title: 'Padang',
        animation: google.maps.Animation.DROP,
        zIndex:1
        // icon: location.icon,
      });
      const infoWindowPadang = new google.maps.InfoWindow({
        content: 'Padang City', // The content to display in the InfoWindow
      });
      
      // Add a click listener to the marker
      markerPadang.addListener('click', () => {
        infoWindowPadang.open(map, markerPadang); // Open the InfoWindow at the marker's position
      });

      function animateFlight(map:any, fromLatLng:any, toLatLng:any) {    
        // Membuat marker pesawat (Ikon pesawat)
        const airplaneIcon = {
          url: '/icon/airplane-icon.png',  // Ganti dengan ikon pesawat yang sesuai
          scaledSize: new google.maps.Size(60, 60), // Ukuran ikon pesawat
          anchor: new google.maps.Point(25, 25),  // Posisi anchor untuk menyesuaikan titik tengah pesawat
        };
      
        const airplaneMarker = new google.maps.Marker({
          position: fromLatLng,
          map: map,
          icon: airplaneIcon,
          title: 'Flight',
        });
      
        let step = 0;
        const totalSteps = 100;  // Jumlah langkah dalam animasi
        const interval = setInterval(() => {
          if (step <= totalSteps) {
            // Menghitung posisi baru marker (pesawat) sepanjang polyline
            const lat = fromLatLng.lat + (toLatLng.lat - fromLatLng.lat) * (step / totalSteps);
            const lng = fromLatLng.lng + (toLatLng.lng - fromLatLng.lng) * (step / totalSteps);
            const newPosition = { lat, lng };
            airplaneMarker.setPosition(newPosition);
            step++;
          } else {
            clearInterval(interval);  // Hentikan animasi setelah mencapai titik akhir
          }
        }, 50); // Ubah interval untuk mengatur kecepatan animasi (lebih kecil lebih cepat)
      
        // return polyline;
      }

      function animateCar(map:any, fromLatLng:any, toLatLng:any) {
        const carIcon = {
          url: '/icon/car.png', // Ganti dengan ikon mobil yang sesuai
          scaledSize: new google.maps.Size(60, 40), // Ukuran ikon mobil
          anchor: new google.maps.Point(20, 20), // Posisi anchor
        };
        const carMarker = new google.maps.Marker({
          position: fromLatLng,
          map: map,
          icon: carIcon,
          title: 'Car Journey',
          zIndex: 1000,
        });
        let step = 0;
        const totalSteps = 100; // Jumlah langkah dalam animasi
        const interval = setInterval(() => {
          if (step <= totalSteps) {
            const lat = fromLatLng.lat + (toLatLng.lat - fromLatLng.lat) * (step / totalSteps);
            const lng = fromLatLng.lng + (toLatLng.lng - fromLatLng.lng) * (step / totalSteps);
            const newPosition = { lat, lng };
            carMarker.setPosition(newPosition);
            step++;
          } else {
            clearInterval(interval); // Hentikan animasi setelah mencapai tujuan
          }
        }, 50); // Kecepatan animasi (50 ms per langkah)
      }
      
      // Menambahkan animasi pesawat dari Singapura ke Padang
      animateFlight(map, singapore, padang);
      animateFlight(map, malaysia, padang)
      animateFlight(map, jakarta, padang)
      const delayInMilliseconds = 6500; // 6,5 detik
      setTimeout(() => {
        animateCar(map, padang, nagariUlakan);
      }, delayInMilliseconds);

      function createTextOverlay(map:any, position:any, steps:any) {
        const overlay = new google.maps.OverlayView();
    
        // Menentukan konten overlay
        overlay.onAdd = function () {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.fontSize = '14px';
          div.style.fontWeight = 'bold';
          div.style.color = 'black';
          div.style.backgroundColor = 'white';
          div.style.padding = '10px';
          div.style.borderRadius = '5px';
          div.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
          div.innerHTML = steps;
          div.style.zIndex = '100';
    
          // Menambahkan div ke container map
          const panes = this.getPanes();
          panes?.overlayLayer.appendChild(div);
    
          // Fungsi untuk memposisikan overlay di atas peta
          this.draw = function () {
            const projection = this.getProjection();
            const positionPixel = projection.fromLatLngToDivPixel(position);
            div.style.left = `${positionPixel?.x}px`;
            div.style.top = `${positionPixel?.y}px`;
          };
        };
    
        // Menambahkan overlay ke peta
        overlay.setMap(map);
        return overlay;
      }
    
      // Overlay untuk Singapura
      const singaporeSteps = `
        <b>From Singapore (SIN):</b><br>
        1. Take a flight from Singapore (SIN) to Padang (PDG), Indonesia.<br>
        2. Rent a car or take a taxi to Nagari Ulakan village.
      `;
      createTextOverlay(map, singapore, singaporeSteps);
    
      // Overlay untuk Malaysia
      const malaysiaSteps = `
        <b>From Kuala Lumpur, Malaysia (KUL):</b><br>
        1. Take a flight from Kuala Lumpur (KUL) to Padang (PDG), Indonesia.<br>
        2. Rent a car or take a taxi to Nagari Ulakan village.
      `;
      createTextOverlay(map, malaysia, malaysiaSteps);
    
      // Overlay untuk Jakarta
      const jakartaSteps = `
        <b>From Jakarta:</b><br>
        1. Take a domestic flight to Padang City (PDG), Indonesia.<br>
        2. Rent a car or take a taxi to Nagari Ulakan village.
      `;
      createTextOverlay(map, jakarta, jakartaSteps);

      const sumateraIslandSteps = `
        <b>From anywhere in Sumatra:</b><br>
        1. Option 1: Travel by land directly to Nagari Ulakan village.<br>
        2. Option 2: Take a flight from your nearest airport in Sumatra to Padang (PDG), Indonesia.<br>
        3. Rent a car or take a taxi from Padang to Nagari Ulakan village.
      `;
      createTextOverlay(map, bandaAceh, sumateraIslandSteps);
      // function createTextOverlay(map:any, position:any, steps:any) {
      //   const overlay = new google.maps.OverlayView();
      
      //   // Menentukan konten overlay
      //   overlay.onAdd = function () {
      //     const div = document.createElement('div');
      //     div.style.position = 'absolute';
      //     div.style.fontSize = '14px';
      //     div.style.fontWeight = 'bold';
      //     div.style.color = 'black';
      //     div.style.backgroundColor = 'white';
      //     div.style.padding = '10px';
      //     div.style.borderRadius = '5px';
      //     div.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
      //     div.innerHTML = steps;
      //     div.style.zIndex = '5';
      
      //     // Menambahkan div ke container map
      //     const panes = this.getPanes();
      //     panes?.overlayLayer.appendChild(div);
      
      //     // Fungsi untuk memposisikan overlay di atas peta
      //     this.draw = function () {
      //       const projection = this.getProjection();
      //       const positionPixel = projection.fromLatLngToDivPixel(position);
      //       div.style.left = `${positionPixel?.x}px`;
      //       div.style.top = `${positionPixel?.y}px`;
      //     };
      //   };
      
      //   // Menambahkan overlay ke peta
      //   overlay.setMap(map);
      //   return overlay;
      // }
      
      // // Fungsi untuk memanggil overlay dengan langkah-langkah
      // const steps = `
      //   <b>Steps to reach Nagari Ulakan:</b><br>
      //   1. Fly to Malaysia or Singapore.<br>
      //   2. Take a flight to Padang city, Indonesia.<br>
      //   3. Rent a car or take a taxi to Nagari Ulakan village.
      // `;
      
      // // Menambahkan overlay ke peta pada posisi tertentu
      // createTextOverlay(map, { lat: 1.277968756621077, lng: 103.843894137210782 }, steps);
    }

    if (traffic) {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map); 
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
          clickable: false,
          zIndex: 6
        })
        digitasiGtp.setMap(map)
      });
    }

    // digitasiNegara.addListener('click', function (event: google.maps.Data.MouseEvent) {
    //   const name = event.feature.getProperty('name');
    //   infoWindow.setContent(`Negara ${name}`)

    //   infoWindow.setPosition(event.latLng);
    //   infoWindow.open(map);
    // });

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

    console.log(object);


    if (object.attraction) {
      const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === 'A');
      filteredData.forEach((item:{id:string,name:string,geom:string,price:number,lat:number,lng:number,type_attr:string,}) => {
        digitasiObject.addGeoJson({
          type: 'Feature',
          properties: { id:item.id, name:'name' },
          geometry: item.geom
        })
        digitasiObject.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiObject.setMap(map)
        //Add a marker at the centroid
        const marker = new google.maps.Marker()
        const markerOptions = {
          map: map,
          position: { lat:item.lat, lng:item.lng },
          title: "Centroid Marker",
          animation: google.maps.Animation.DROP,
          icon: `/icon/attraction.png`
        }
        marker.setOptions(markerOptions)
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          // Setel animasi kembali ke null setelah 1.7 detik
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1700);

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentAttraction id={item.id} name={item.name} type={item.type_attr} price={item.price} lat={item.lat} lng={item.lng} explore={0} onRouteClick={handleRouteButtonClick} />);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
      });
    }
    if (object.culinaryPlace) {
      const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === 'CP');
      console.log(filteredData);
      filteredData.forEach((item:{id:string,name:string,geom:string,price:number,lat:number,lng:number,address:string,contact_person:string}) => {
        digitasiObject.addGeoJson({
          type: 'Feature',
          properties: { id:item.id, name:'name' },
          geometry: item.geom
        })
        digitasiObject.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiObject.setMap(map)
        //Add a marker at the centroid
        const marker = new google.maps.Marker()
        const markerOptions = {
          map: map,
          position: { lat:item.lat, lng:item.lng },
          title: "Centroid Marker",
          animation: google.maps.Animation.DROP,
          icon: `/icon/culinary.png`
        }
        bounds.extend(new google.maps.LatLng(item.lat, item.lng));
        marker.setOptions(markerOptions)
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          // Setel animasi kembali ke null setelah 1.7 detik
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1700);

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentBrowseCulinaryPlaces id={item.id} name={item.name} contact_person={item.contact_person} lat={item.lat} 
            lng={item.lng} address={item.address} onRouteClick={handleRouteButtonClick} browse={browsePlace} 
            onBrowseRespond={handleBrowseRespond}/>);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
        if (browsePlace && map && !bounds.isEmpty()) {
          map.fitBounds(bounds, { 
            top: 50, right: 50, bottom: 50, left: 50 
          });
        }
      });
    }
    if (object.worshipPlace) {
      const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === 'WP');
      console.log(filteredData);
      filteredData.forEach((item:{id:string,name:string,geom:string,price:number,lat:number,lng:number,address:string,capacity:number}) => {
        digitasiObject.addGeoJson({
          type: 'Feature',
          properties: { id:item.id, name:'name' },
          geometry: item.geom
        })
        digitasiObject.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiObject.setMap(map)
        //Add a marker at the centroid
        const marker = new google.maps.Marker()
        const markerOptions = {
          map: map,
          position: { lat:item.lat, lng:item.lng },
          title: "Centroid Marker",
          animation: google.maps.Animation.DROP,
          icon: `/icon/worship.png`
        }
        marker.setOptions(markerOptions)
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          // Setel animasi kembali ke null setelah 1.7 detik
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1700);

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentBrowseWorshipPlaces id={item.id} name={item.name} capacity={item.capacity} lat={item.lat} lng={item.lng} address={item.address} 
            onRouteClick={handleRouteButtonClick} browse={browsePlace} 
            onBrowseRespond={handleBrowseRespond}/>);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
      });
    }
    if (object.souvenirPlace) {
      const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === 'SP');
      console.log(filteredData);
      filteredData.forEach((item:{id:string,name:string,geom:string,price:number,lat:number,lng:number,address:string,contact_person:string}) => {
        digitasiObject.addGeoJson({
          type: 'Feature',
          properties: { id:item.id, name:'name' },
          geometry: item.geom
        })
        digitasiObject.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiObject.setMap(map)
        //Add a marker at the centroid
        const marker = new google.maps.Marker()
        const markerOptions = {
          map: map,
          position: { lat:item.lat, lng:item.lng },
          title: "Centroid Marker",
          animation: google.maps.Animation.DROP,
          icon: `/icon/souvenir.png`
        }
        marker.setOptions(markerOptions)
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          // Setel animasi kembali ke null setelah 1.7 detik
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1700);

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentBrowseSouvenirPlaces id={item.id} name={item.name} contact_person={item.contact_person} lat={item.lat} lng={item.lng} address={item.address} 
            onRouteClick={handleRouteButtonClick} browse={browsePlace} 
            onBrowseRespond={handleBrowseRespond}/>);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
      });
    }
    if (object.homestay) {
      const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === 'HO');
      filteredData.forEach((item:{id:string,name:string,geom:string,price:number,lat:number,lng:number,address:string,contact_person:string}) => {
        digitasiObject.addGeoJson({
          type: 'Feature',
          properties: { id:item.id, name:'name' },
          geometry: item.geom
        })
        digitasiObject.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: true
        })
        digitasiObject.setMap(map)
        //Add a marker at the centroid
        const marker = new google.maps.Marker()
        const markerOptions = {
          map: map,
          position: { lat:item.lat, lng:item.lng },
          title: "Centroid Marker",
          animation: google.maps.Animation.DROP,
          icon: `/icon/homestay.png`
        }
        marker.setOptions(markerOptions)
        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          // Setel animasi kembali ke null setelah 1.7 detik
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1700);

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<MapContentBrowseHomestayPlaces id={item.id} name={item.name} contact_person={item.contact_person} lat={item.lat} lng={item.lng} address={item.address} 
            onRouteClick={handleRouteButtonClick} browse={browsePlace} 
            onBrowseRespond={handleBrowseRespond}/>);
          new google.maps.InfoWindow({
            content: document.body.appendChild(container)
          }).open(map, marker)
        });
      });
    }
  }

  const setDistancesAndInstructions = (myRoute: any) => {
    distances = myRoute.steps.map((step: Step) => step.distance?.value || 0);
    instructions = myRoute.steps.map((step: Step) => step.instructions || '');
    setDistances(distances);
    setInstructions(instructions);
  };

  const handleRouteButtonClick = (lat: number, lng: number) => {
    console.log('ni di route button');
    
    if (userLocation) {
      console.log('ada lo user locationnya kok');
      
      routeArray.forEach((directionsRenderer: google.maps.DirectionsRenderer) => {
        directionsRenderer.setMap(null);
      });
      routeArray.length = 0;
      const directionsService = new google.maps.DirectionsService();

      let start: google.maps.LatLng, end: google.maps.LatLng;
      start = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      end = new google.maps.LatLng(lat, lng)
      console.log(end, 'nilai end nihhh');
      
      const request: google.maps.DirectionsRequest = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
      ) {
        if (status === 'OK' && result !== null) {
          const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
          directionsRenderer.setDirections(result);
          routeArray.push(directionsRenderer);
          directionsRenderer.setMap(map);

          const myRoute = result.routes[0].legs[0];
          setDistancesAndInstructions(myRoute);
          boundToRoute(start, end);
        }
      });
    }
  }

  const handleBrowseRespond = (id: string, name:string) => {
    setBrowseId(id)
    setBrowseName(name)
  }

  const boundToRoute = (start: google.maps.LatLng, end: google.maps.LatLng) => {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map?.fitBounds(bounds);
  };

  const setShowLegendVisibility = () => {
    if (legendRef.current) {
      const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
      if (legendContent) legendContent.style.display = showLegend ? 'block' : 'none';
    }
  };

  const generateMarkerCulinaryPlaces = (item: dataListGeom) => {
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
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)

      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentCulinaryPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateMarkerWorshipPlaces = (item: dataListGeom) => {
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
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (capacity) root.render(<MapContentWorshipPlaces id={id} name={name} address={address} capacity={capacity} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container),
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateSouvenirPlace = (item: dataListGeom) => {
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
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentSouvenirPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  const generateHomestayPlace = (item: dataListGeom) => {
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
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1700)
      const container = document.createElement('div');
      const root = createRoot(container);
      if (contact_person) root.render(<MapContentHomestayPlaces id={id} name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    markerArray[id] = marker
  }

  useEffect(() => {
    if (map) {
      const styles: google.maps.MapTypeStyle[] = [
        {
          featureType: 'administrative',
          elementType: 'labels',
          stylers: [{ visibility: showLabels ? 'on' : 'off' }],
        },
      ];
  
      map.setOptions({
        styles: styles,
        mapTypeId: showTerrain ? 'terrain' : 'roadmap',
      });
    }
  }, [map, showLabels, showTerrain]);

  useEffect(() => {
    initMap(kotaKabData, kecData, villageData, gtpData) 
  }, [kotaKabData, kecData, villageData, gtpData, visibility, reachToObject, traffic, object, browsePlace])

  useEffect(() => {
    setShowLegendVisibility();
  }, [showLegend]);

  useEffect(() => {
    Object.keys(markerArray).forEach((key) => {
      const marker = markerArray[key] as google.maps.Marker;
      marker.setMap(null);
    });
    markerArray = {};
    if (dataMapforType !== null) {
      const firstIdData = dataMapforType[0].id

      routeArray.forEach((directionsRenderer: google.maps.DirectionsRenderer) => {
        directionsRenderer.setMap(null);
      });
      routeArray.length = 0;
      setDistances([])
      setInstructions([])

      if (firstIdData.startsWith("CP")) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateMarkerCulinaryPlaces(item)
        })
      } else if (firstIdData.startsWith('WP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateMarkerWorshipPlaces(item)
        })
      } else if (firstIdData.startsWith('SP')) {
        dataMapforType.forEach((item: dataListGeom) => {
          generateSouvenirPlace(item)
        })
      } else {
        dataMapforType.forEach((item: dataListGeom) => {
          generateHomestayPlace(item)
        })
      }
      if (Object.keys(markerArray).length > 0 && map) {
        const bounds = new google.maps.LatLngBounds();
        for (const i in markerArray) {
          const positionArray = markerArray[i].getPosition();
          if (positionArray) bounds.extend(positionArray);
        }
        map.fitBounds(bounds);
      }
    }
  }, [dataMapforType, userLocation])

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (userLocation !== null && map) {
        // console.log(isManualLocation, 'di userLocation');
        setIsManualLocation(false)
        if (locationMarkerRef.current !== null) locationMarkerRef.current.setMap(null);
        const newMarkerLocation = new google.maps.Marker();
        const markerOptions = {
          position: userLocation,
          map: map,
          animation: google.maps.Animation.DROP,
        }
        newMarkerLocation.setOptions(markerOptions)

        infoWindowLocMarkerRef.current = new google.maps.InfoWindow({
          content: `<p>You Are Here</p>`
        });
        newMarkerLocation.addListener('click', () => {
          infoWindowLocMarkerRef.current?.open(map, newMarkerLocation);
        });
        locationMarkerRef.current = newMarkerLocation
        infoWindowLocMarkerRef.current?.open(map, locationMarkerRef.current)
      }
    }
    fetchUserLocation()
  }, [userLocation])

  useEffect(() => {
    // console.log(isManualLocation, 'di isManualLocation');
    let clickListener: google.maps.MapsEventListener | null = null;
    const handleMapClick = (mapsMouseEvent: any) => {
      const newLocation = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng()
      };
      setUserLocation({
        lat: newLocation.lat,
        lng:newLocation.lng
      });
      console.log(newLocation);
      console.log(userLocation);

      if (clickListener) {
        clickListener.remove();
        clickListener = null;
      }
    };
    if (isManualLocation === true && map) clickListener = map.addListener('click', handleMapClick);

    return () => {
      if (clickListener) {
        clickListener.remove();
      }
    };
  }, [isManualLocation])

  useEffect(() => {
    const fetchObjectAroundRadius = async () => {
      if (userLocation && map && locationMarkerRef.current && radius !== null) {
        
        Object.keys(markerArray).forEach((key) => {
          const marker = markerArray[key] as google.maps.Marker;
          marker.setMap(null);
        });
        markerArray = {};

        if (circleRef.current !== null) circleRef.current.setMap(null)
        const circle = new google.maps.Circle({
          map: map,
          radius: radius,  // dalam meter
          fillColor: '#AA0000',
          fillOpacity: 0.3,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          zIndex:100
        });
        circleRef.current = circle
        circleRef.current.bindTo('center', locationMarkerRef.current, 'position')

        infoWindowLocMarkerRef.current?.open(map, locationMarkerRef.current);
        map.panTo(userLocation);
        locationMarkerRef.current = locationMarkerRef.current;

        if (objectAround && radius) {
          const lat = userLocation.lat
          const lng = userLocation.lng
          if (objectAround.culinaryPlaces === true) {
            console.log('true si culinary');
            
            try {
              const res = await useAxiosAuth.get(`/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
              const dataObject = res.data.data
              dataObject.forEach((item: dataListGeom) => {
                generateMarkerCulinaryPlaces(item)
              });
            } catch (error) {
              console.log(error);
            }
          }
          if (objectAround.worshipPlaces === true) {
            const res = await useAxiosAuth.get(`/worship/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateMarkerWorshipPlaces(item)
            })
          }
          if (objectAround.souvenirPlaces === true) {
            const res = await useAxiosAuth.get(`/souvenir/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateSouvenirPlace(item)
            })
          }
          if (objectAround.homestay === true) {
            const res = await useAxiosAuth.get(`/homestay/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
              generateHomestayPlace(item)
            })
          }
        }
      }
    }
    fetchObjectAroundRadius()
  }, [radius])

  const addMarker = (
    name: string, id:string, position: google.maps.LatLng, icon: string | null,
    activity:string, type_attr: string|null, address: string|null, 
    contact_person: string|null, capacity: string | null,
    lat: number, lng: number ) => {
    const markerOptions: google.maps.MarkerOptions = {
      position: position,
      map: map, // map is the reference to the map
      animation: google.maps.Animation.DROP,
      // label: `${activity}`,
    };

    // Set custom icon only if it’s provided
    if (icon) {
        markerOptions.icon = `/icon/${icon}.png`;
    }

    const marker = new google.maps.Marker(markerOptions);
    markersRef.current.push(marker);

    // marker.addListener('click', () => {
    //     marker.setAnimation(google.maps.Animation.BOUNCE)
    //     setTimeout(() => {
    //         marker.setAnimation(null)
    //     }, 1700)
    // });
    marker.addListener('click', () => {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1700);

      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(<MapContentGeneral id={id} icon={icon} name={name} address={address} capacity={capacity} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} />);
      new google.maps.InfoWindow({
        content: document.body.appendChild(container)
      }).open(map, marker)
    });
    // updateBounds();
    const bounds = new google.maps.LatLngBounds();
    markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition() as google.maps.LatLng);
    });
    map?.fitBounds(bounds);
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
        marker.setMap(null);
    });
    markersRef.current = [];
  };

  useEffect(() => {
    if (goToObject) {
      const navigateToObject = () => {
        if (map) {
          const object: google.maps.LatLngLiteral = position
          map.panTo(object);
          map.setZoom(13);
          setGoToObject(false)
        }
        setGoToObject(false)
      }
      navigateToObject();
    }
  }, [goToObject])

  useEffect(() => {
    let clickListener: google.maps.MapsEventListener | null = null;
    const handleMapClick = (mapsMouseEvent: any) => {
      const newLocation = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng()
      };
      setUserLocation({
        lat: newLocation.lat,
        lng:newLocation.lng
      });

      if (clickListener) {
        clickListener.remove();
        clickListener = null;
      }
    };
    if (isManualLocation === true && map) clickListener = map.addListener('click', handleMapClick);

    return () => {
      if (clickListener) {
        clickListener.remove();
      }
    };
  }, [isManualLocation])

  useEffect(() => {
    clearMarkers();
    routeRenderersRef.current.forEach((renderer) => renderer.setMap(null));
    routeRenderersRef.current = [];
    if (dayActivities.length > 0 || selectActivities != null) {
      // console.log(dataListAllObject);
      
      const objectMap = dataListAllObject.reduce((map:any, obj:any) => {
        map[obj.id] = { 
          lat: obj.lat, lng: obj.lng, name:obj.name, id: obj.id,
          address:obj.address, capacity:obj.capacity, contact_person:obj.contact_person, 
          type_attr:obj.type_attr };
        return map;
      }, {});

      Object.keys(markerArray).forEach((key) => {
        const marker = markerArray[key] as google.maps.Marker;
        marker.setMap(null);
      });
      markerArray = {};

      if (dayActivities.length > 0) {
        const dayActivitiesWithCoordinates = dayActivities.map(activity => {
          const coordinates = objectMap[activity.object_id] || { lat: null, lng: null };
          return {
            ...activity,
            id:coordinates.id,
            lat: coordinates.lat,
            lng: coordinates.lng,
            name: coordinates.name,
            address: coordinates.address,
            capacity: coordinates.capacity,
            contact_person: coordinates.contact_person,
            type_attr: coordinates.type_attr
          };
        });
        console.log('ini day selectnya',dayActivitiesWithCoordinates);
        dayActivitiesWithCoordinates.forEach((activity) => {
          // console.log(activity);
          
          if (activity.lat !== null && activity.lng !== null) {
            if (activity.type === 'EV') {
              const pos = new google.maps.LatLng(activity.lat, activity.lng)
              addMarker(activity.name, activity.id, pos, 'event', activity.activity, activity.type_attr, null, null, null, activity.lat, activity.lng)
            } else if (activity.type === 'CP') {
              const pos = new google.maps.LatLng(activity.lat, activity.lng)
              addMarker(activity.name, activity.id, pos, 'culinary', activity.activity, null, activity.address, activity.contact_person, null, activity.lat, activity.lng)
            } else if (activity.type === 'WP') {
              const pos = new google.maps.LatLng(activity.lat!, activity.lng)
              addMarker(activity.name, activity.id, pos, 'worship', activity.activity, null, activity.address, null, activity.capacity, activity.lat, activity.lng)
            } else if (activity.type === 'HO') {
                const pos = new google.maps.LatLng(activity.lat!, activity.lng)
                addMarker(activity.name, activity.id, pos, 'homestay', activity.activity, null, null, null, null, activity.lat, activity.lng)
            } else if (activity.type === 'SP') {
                const pos = new google.maps.LatLng(activity.lat!, activity.lng)
                addMarker(activity.name, activity.id, pos, 'souvenir', activity.activity, null, activity.address, activity.contact_person, null, activity.lat, activity.lng)
            } else if (activity.type === 'A') {
              const pos = new google.maps.LatLng(activity.lat!, activity.lng)
              addMarker(activity.name, activity.id, pos, 'attraction', activity.activity, null, activity.address, activity.contact_person, null, activity.lat, activity.lng)
            } else {
                const pos = new google.maps.LatLng(activity.lat!, activity.lng)
                addMarker(activity.name, activity.id, pos, null, activity.activity,null, null, null, null, activity.lat, activity.lng)
            }
          }
        });
        if (dayActivitiesWithCoordinates.length > 1) {
          console.log(dayActivitiesWithCoordinates);
          
          const directionsService = new google.maps.DirectionsService();

          // Start point
          const start = new google.maps.LatLng(
              dayActivitiesWithCoordinates[0].lat,
              dayActivitiesWithCoordinates[0].lng
          );

          // End point
          const end = new google.maps.LatLng(
              dayActivitiesWithCoordinates[dayActivitiesWithCoordinates.length - 1].lat,
              dayActivitiesWithCoordinates[dayActivitiesWithCoordinates.length - 1].lng
          );

          // Intermediate waypoints (all points except the first and last)
          const waypoints = dayActivitiesWithCoordinates.slice(1, -1).map((activity) => ({
              location: new google.maps.LatLng(activity.lat, activity.lng),
              stopover: true
          }));

          const request: google.maps.DirectionsRequest = {
              origin: start,
              destination: end,
              waypoints: waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false,
          };

          directionsService.route(request, function (
              result: google.maps.DirectionsResult | null,
              status: google.maps.DirectionsStatus
          ) {
              if (status === google.maps.DirectionsStatus.OK && result !== null) {
                  const directionsRenderer = new google.maps.DirectionsRenderer({ map: map, suppressMarkers: true, });
                  directionsRenderer.setDirections(result);
                  routeRenderersRef.current.push(directionsRenderer);
                  const myRoute = result.routes[0].legs[0];
                  setDistancesAndInstructions(myRoute);
              } else {
                  console.error("Directions request failed due to: " + status);
              }
          });
        }
      }
      if (selectActivities != null) {
        let startCoordinates: Coordinates; // Declare the type here
        if (selectActivities.start === '0') {
          startCoordinates = { lat: -0.709021, lng: 100.198740 }; // Assign hardcoded coordinates
        } else {
          startCoordinates = objectMap[selectActivities.start] || { lat: null, lng: null }; // Fallback to null if not found
        }
        const endCoordinates = objectMap[selectActivities.end] || { lat: null, lng: null };

        // const directionsService = new google.maps.DirectionsService();
        // const start = new google.maps.LatLng(startCoordinates.lat, startCoordinates.lng);
        // const end = new google.maps.LatLng(endCoordinates.lat, endCoordinates.lng);
        // console.log('Selected activities with coordinates:', selectActivitiesWithCoordinates);
        if (startCoordinates.lat !== null && startCoordinates.lng !== null &&
          endCoordinates.lat !== null && endCoordinates.lng !== null) {
            const selectActivitiesWithCoordinates = {
              start: {
                object_id: selectActivities.start,
                lat: startCoordinates.lat,
                lng: startCoordinates.lng,
              },
              end: {
                object_id: selectActivities.end,
                lat: endCoordinates.lat,
                lng: endCoordinates.lng,
              }
            };
          const directionsService = new google.maps.DirectionsService();
          const start = new google.maps.LatLng(startCoordinates.lat, startCoordinates.lng);
          const end = new google.maps.LatLng(endCoordinates.lat, endCoordinates.lng);
          const request: google.maps.DirectionsRequest = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function (
            result: google.maps.DirectionsResult | null,
            status: google.maps.DirectionsStatus
          ) {
            if (status === 'OK' && result !== null) {
              const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
              directionsRenderer.setDirections(result);
              routeRenderersRef.current.push(directionsRenderer);
              const myRoute = result.routes[0].legs[0];
              setDistancesAndInstructions(myRoute);
              // Additional handling like setting distances and instructions can be added here
            } else {
              console.error("Directions request failed due to: " + status);
            }
          });
        }
      }
    }
  }, [dayActivities,selectActivities,dataListAllObject, userLocation])

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