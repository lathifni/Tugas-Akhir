'use client'

import { fetchGeomGtp, fetchListAllObject } from "@/app/(pages)/api/fetchers/gtp"
import { fetchEstuaryGeom, fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef } from "react"
import useAxiosAuth from "../../../libs/useAxiosAuth"
import { MapContentCulinaryPlaces, MapContentWorshipPlaces, MapContentSouvenirPlaces, MapContentHomestayPlaces, Legend, MapContentGeneral } from "./mapHelper"
import { createRoot } from 'react-dom/client';

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
  selectActivities: { start:any; end:any } | null;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  showTerrain: boolean;
  setShowTerrain: (value: boolean) => void;
  traffic: boolean | false ;
  reachToObject: boolean | false ;
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
const positionGtp = {
  lat: -0.7102134517843606,
  lng: 100.19420485758688
}
let markerArray: any = {};
let routeArray: any = [];

export default function MapExploreUlakanCopy({
  userLocation, dataMapforType, radius, isManualLocation, setIsManualLocation, setUserLocation
  , objectAround, distances, setDistances, instructions, setInstructions, showLegend
  ,dayActivities, selectActivities, showLabels, setShowLabels, showTerrain, setShowTerrain
  , traffic, reachToObject
}: MapExploreUlakanProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const legendRef = React.useRef<HTMLDivElement>(null);
  let locationMarkerRef = useRef<google.maps.Marker | null>(null);
  let infoWindowLocMarkerRef = useRef<google.maps.InfoWindow | null>(null);
  let circleRef = useRef<google.maps.Circle | null>(null);
  const routeRenderersRef = useRef<google.maps.DirectionsRenderer[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
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

  const initMap = async (dataUlakanVillage: any[], dataGeomGtp: any[]) => {
    const { Map } = await loader.importLibrary('maps')
    window.google = google;
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
    const digitasiEstuary = new google.maps.Data()
    const infoWindow = new google.maps.InfoWindow();

    if (dataUlakanVillage && Array.isArray(dataUlakanVillage)) {
      dataUlakanVillage.forEach((item: { name: string, geom: string }) => {
        const geom = item.geom;

        digitasiVillage.addGeoJson({
          type: 'Feature',
          geometry: geom
        })

        digitasiVillage.setStyle({
          fillColor: '#ADFF2F',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: false
        })
        digitasiVillage.setMap(map)
      })
      // digitasiVillage.addListener('click', function (event: google.maps.Data.MouseEvent) {
      //   infoWindow.setContent(`Nagari Ulakan`)
      //   infoWindow.setPosition(event.latLng);
      //   infoWindow.open(map);
      // });
    }

    if (dataGeomGtp && Array.isArray(dataGeomGtp)) {
      dataGeomGtp.forEach((item: { geom: string }) => {
        const geom = item.geom;

        digitasiGtp.addGeoJson({
          type: 'Feature',
          geometry: geom
        })

        digitasiGtp.setStyle({
          fillColor: '#32CD32',
          strokeWeight: 0.5,
          strokeColor: '#ffffff',
          fillOpacity: 0.5,
          clickable: false
        })
        digitasiGtp.setMap(map)
      })
      // digitasiGtp.addListener('click', function (event: google.maps.Data.MouseEvent) {
      //   infoWindow.setContent(`Green Talao Park`)
      //   infoWindow.setPosition(event.latLng);
      //   infoWindow.open(map);
      // });
    }
    if (geomEstuary) {
      console.log(geomEstuary);
      digitasiEstuary.addGeoJson({
          type: 'Feature',
          geometry: geomEstuary[0].geom
      });
      digitasiEstuary.setStyle({
          fillColor: '#A0522D', // Warna coklat sedang
          strokeWeight: 3,
          strokeColor: '#8B4513', // Warna coklat gelap untuk garis tepi
          fillOpacity: 0.8, // Kurangi opacity agar lebih transparan
          clickable: false
      });
      digitasiEstuary.setMap(map);
    }
    if (traffic) {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map); 
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
  };

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
    initMap(dataUlakanVillage, dataGeomGtp);
  }, [dataGeomGtp, dataUlakanVillage, traffic, reachToObject])

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
          strokeWeight: 2
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