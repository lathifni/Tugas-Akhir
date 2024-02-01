'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp";
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Legend } from "./mapHelper";

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

interface MapPackageProps {
    // userLocation: UserLocation | null;
    // dataMapforType: dataListGeom[] | null
    // radius?: number | null;
    // objectAround: MapType | null;
    // isManualLocation: boolean;
    // setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
    // setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
    // distances: number[];
    // instructions: string[];
    // setDistances: React.Dispatch<React.SetStateAction<number[]>>;
    // setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
    showLegend: boolean | false;
  }

interface UserLocation {
    lat: number;
    lng: number;
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

export default function MapPackage({
     showLegend
  }: MapPackageProps) {
    const mapRef = React.useRef<HTMLDivElement>(null)
    const legendRef = React.useRef<HTMLDivElement>(null);

    const { data: gtpData, isLoading: loadingGtp } = useQuery({
        queryKey: ['geomGtp'],
        queryFn: fetchGeomGtp
    })

    const initMap = async (gtpData: any[]) => {
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

        map = new Map(mapRef.current as HTMLDivElement, mapOptions)
        const digitasiGtp = new google.maps.Data()

        if (gtpData && Array.isArray(gtpData)) {
            gtpData.forEach((item: { geom: string }) => {
                console.log(gtpData);
                const geom: string = JSON.parse(item.geom)

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
    }

    useEffect(() => {
        initMap(gtpData)
    }, [gtpData])

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