'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp"
import { fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import useAxiosAuth from "../../../libs/useAxiosAuth"
import { MapContentCulinaryPlaces, MapContentWorshipPlaces, MapContentSouvenirPlaces, MapContentHomestayPlaces } from "./mapHelper"
import { createRoot } from 'react-dom/client';
let markerArray: any = {};
let routeArray: any = []

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
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
  distances: number[];
  instructions: string[];
  setDistances: React.Dispatch<React.SetStateAction<number[]>>;
  setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Step {
  distance?: {
    value?: number;
  };
  instructions?: string;
  // tambahkan properti lain jika diperlukan
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

export default function MapExploreUlakan({
  userLocation, dataMapforType, radius, isManualLocation, setUserLocation, objectAround, distances, setDistances, instructions, setInstructions
}: MapExploreUlakanProps) {
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

  const setDistancesAndInstructions = (myRoute: any) => {
    distances = myRoute.steps.map((step: Step) => step.distance?.value || 0);
    instructions = myRoute.steps.map((step: Step) => step.instructions || '');
    // setDistances(distances);
    // setInstructions(instructions);
  };

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
        const geom = JSON.parse(item.geom)

        digitasiVillage.addGeoJson({
          type: 'Feature',
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
      const boundToRoute = (start: google.maps.LatLng, end: google.maps.LatLng) => {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        map?.fitBounds(bounds);
      };
      const handleRouteButtonClick = (lat: number, lng: number) => {
        if (userLocation) {
          routeArray.forEach((directionsRenderer: google.maps.DirectionsRenderer) => {
            directionsRenderer.setMap(null);
          });
          routeArray.length = 0;
          const directionsService = new google.maps.DirectionsService();

          let start: google.maps.LatLng, end: google.maps.LatLng;
          start = new google.maps.LatLng(userLocation.lat, userLocation.lng);
          end = new google.maps.LatLng(lat, lng)

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
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(() => {
              marker.setAnimation(null)
            }, 1700)

            const container = document.createElement('div');
            const root = createRoot(container);
            if (contact_person) root.render(<MapContentCulinaryPlaces name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} id={id} />);
            new google.maps.InfoWindow({
              content: document.body.appendChild(container)
            }).open(map, marker)
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
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(() => {
              marker.setAnimation(null)
            }, 1700)
            const container = document.createElement('div');
            const root = createRoot(container);
            if (capacity) root.render(<MapContentWorshipPlaces name={name} address={address} capacity={capacity} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} id={id}/>);
            new google.maps.InfoWindow({
              content: document.body.appendChild(container),
            }).open(map, marker)
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
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(() => {
              marker.setAnimation(null)
            }, 1700)
            const container = document.createElement('div');
            const root = createRoot(container);
            if (contact_person) root.render(<MapContentSouvenirPlaces name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} id={id}/>);
            new google.maps.InfoWindow({
              content: document.body.appendChild(container)
            }).open(map, marker)
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
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(() => {
              marker.setAnimation(null)
            }, 1700)
            const container = document.createElement('div');
            const root = createRoot(container);
            if (contact_person) root.render(<MapContentHomestayPlaces name={name} address={address} contact_person={contact_person} lat={lat} lng={lng} onRouteClick={handleRouteButtonClick} id={id}/>);
            new google.maps.InfoWindow({
              content: document.body.appendChild(container)
            }).open(map, marker)
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

    if (isManualLocation) {
      const manualUserLocation = map.addListener('click', (mapsMouseEvent: any) => {
        const newLocation = {
          lat: mapsMouseEvent.latLng.lat(),
          lng: mapsMouseEvent.latLng.lng()
        };
        // Perbarui userLocation dengan lokasi baru
        setUserLocation(newLocation);
      })
    }

    if (userLocation !== null) {
      const marker = new google.maps.Marker();
      const markerOptions = {
        position: userLocation,
        map: map,
        animation: google.maps.Animation.DROP,
      }
      marker.setOptions(markerOptions)
      const infoWindow = new google.maps.InfoWindow({
        content: `<p>You Are Here</p>`
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      if (radius !== null) {
        const circle = new google.maps.Circle({
          map: map,
          radius: radius,  // dalam meter
          fillColor: '#AA0000',
          fillOpacity: 0.3,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2
        });
        circle.bindTo('center', marker, 'position')
      }
      infoWindow.open(map, marker);
      map.panTo(userLocation);

      if (objectAround && radius) {
        const lat = userLocation.lat
        const lng = userLocation.lng
        if (objectAround.culinaryPlaces === true) {
          try {
            const res = await useAxiosAuth.get(`/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
            const dataObject = res.data.data

            dataObject.forEach((item: dataListGeom) => {
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
                }).open(map, marker)
              });
              markerArray[id] = marker
            });
          } catch (error) {
            console.log(error);
          }

        }
        if (objectAround.worshipPlaces === true) {
          const res = await useAxiosAuth.get(`/worship/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
          const dataObject = res.data.data

          dataObject.forEach((item: dataListGeom) => {
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
              }).open(map, marker)
            });
            markerArray[id] = marker
          })
        }
        if (objectAround.souvenirPlaces === true) {
          const res = await useAxiosAuth.get(`/souvenir/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
          const dataObject = res.data.data

          dataObject.forEach((item: dataListGeom) => {
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
              }).open(map, marker)
            });
            markerArray[id] = marker
          })
        }
        if (objectAround.homestay === true) {
          const res = await useAxiosAuth.get(`/homestay/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`)
          const dataObject = res.data.data

          dataObject.forEach((item: dataListGeom) => {
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
              }).open(map, marker)
            });
            markerArray[id] = marker
          })
        }
      }
    }
  };

  useEffect(() => {
    initMap(dataUlakanVillage, dataGeomGtp);
  }, [queryMutiple(), dataMapforType, isManualLocation, objectAround])

  useEffect(() => {
    setDistances(distances);
    setInstructions(instructions);
  }, [distances])
  
  return (
    <div style={{ height: '500px' }} ref={mapRef} className="text-slate-700"></div>
  )
  
}

