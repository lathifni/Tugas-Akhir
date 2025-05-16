'use client'

import { fetchGeomGtp } from "@/app/(pages)/api/fetchers/gtp";
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Legend } from "./mapHelper";

interface dataActivityDay {
    id: string;
    activity_name: string;
    activity_type: string;
    activity_lat: number;
    activity_lng: number;
}

interface dataRouteActivity {
    end: { activityName: string, lat: number, lng: number };
    journeys: number;
    start: { activityName: string, lat: number, lng: number };
}

interface MapPackageProps {
    // userLocation: UserLocation | null;
    // dataMapforType: dataListGeom[] | null
    // radius?: number | null;
    // objectAround: MapType | null;
    // isManualLocation: boolean;
    // setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
    // setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
    distances: number[];
    instructions: string[];
    setDistances: React.Dispatch<React.SetStateAction<number[]>>;
    setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
    showLegend: boolean | false;
    dataActivityDay: dataActivityDay[] | null;
    dataRouteActivity: dataRouteActivity[] | null;
    setDataActivityDay: React.Dispatch<React.SetStateAction<dataActivityDay[] | null>>;
    setDataRouteActivity: React.Dispatch<React.SetStateAction<dataRouteActivity[] | null>>;
    jenisnya: string;
}

interface UserLocation {
    lat: number;
    lng: number;
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

export default function MapPackage({ showLegend, dataActivityDay, dataRouteActivity, distances, setDistances, instructions, setInstructions, setDataActivityDay, setDataRouteActivity, jenisnya }: MapPackageProps) {
    const mapRef = React.useRef<HTMLDivElement>(null)
    const legendRef = React.useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const routeRenderersRef = useRef<google.maps.DirectionsRenderer[]>([]);

    const { data: gtpData, isLoading: loadingGtp } = useQuery({
        queryKey: ['geomGtp'],
        queryFn: fetchGeomGtp
    })

    const initMap = async (gtpData: any[], dataActivityDay: dataActivityDay[] | null, dataRouteActivity: dataRouteActivity[] | null) => {
        const { Map } = await loader.importLibrary('maps')
        window.google = google;
        const mapOptions: google.maps.MapOptions = {
            center: position,
            zoom: 16,
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

        const addMarker = (position: google.maps.LatLng, icon: string) => {
            const marker = new google.maps.Marker({
                position: position,
                map: map, // map adalah referensi ke peta
                animation: google.maps.Animation.DROP,
                icon: `/icon/${icon}.png`
            });

            markersRef.current.push(marker);

            marker.addListener('click', () => {
                marker.setAnimation(google.maps.Animation.BOUNCE)
                setTimeout(() => {
                    marker.setAnimation(null)
                }, 1700)
            });
            updateBounds();
        };

        const updateBounds = () => {
            const bounds = new google.maps.LatLngBounds();

            markersRef.current.forEach(marker => {
                bounds.extend(marker.getPosition() as google.maps.LatLng);
            });
            map?.fitBounds(bounds);
        };
        const boundToRoute = (start: google.maps.LatLng, end: google.maps.LatLng) => {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(start);
            bounds.extend(end);
            map?.fitBounds(bounds);
        };

        const clearMarkers = () => {
            markersRef.current.forEach(marker => {
                marker.setMap(null);
            });
            markersRef.current = [];
        };
        const clearRouteRenderers = () => {
            routeRenderersRef.current.forEach(renderer => {
                renderer.setMap(null);
            });
            routeRenderersRef.current = [];
        };

        if (jenisnya === 'journey') setDataActivityDay(null)
        else setDataRouteActivity(null)

        if (dataActivityDay !== null && Array.isArray(dataActivityDay)) {
            clearRouteRenderers()
            dataActivityDay.forEach((item: dataActivityDay) => {
                if (item.activity_type === 'EV') {
                    const pos = new google.maps.LatLng(item.activity_lat, item.activity_lng)
                    addMarker(pos, 'event')
                } else if (item.activity_type === 'CP') {
                    const pos = new google.maps.LatLng(item.activity_lat, item.activity_lng)
                    addMarker(pos, 'culinary')
                } else if (item.activity_type === 'WP') {
                    const pos = new google.maps.LatLng(item.activity_lat!, item.activity_lng)
                    addMarker(pos, 'worship')
                } else if (item.activity_type === 'HO') {
                    const pos = new google.maps.LatLng(item.activity_lat!, item.activity_lng)
                    addMarker(pos, 'homestay')
                } else if (item.activity_type === 'SP') {
                    const pos = new google.maps.LatLng(item.activity_lat!, item.activity_lng)
                    addMarker(pos, 'souvenir')
                } else {
                    const pos = new google.maps.LatLng(item.activity_lat!, item.activity_lng)
                    addMarker(pos, 'event')
                }
            })
            setDistances([])
            setInstructions([])
        }
        if (dataRouteActivity !== null && Array.isArray(dataRouteActivity)) {
            clearMarkers();
            const directionsService = new google.maps.DirectionsService();
            let start: google.maps.LatLng, end: google.maps.LatLng;
            start = new google.maps.LatLng(dataRouteActivity[0].start.lat, dataRouteActivity[0].start.lng);
            end = new google.maps.LatLng(dataRouteActivity[0].end.lat, dataRouteActivity[0].end.lng)

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
                    boundToRoute(start, end);
                }
            })
        }
    }

    const setDistancesAndInstructions = (myRoute: any) => {
        distances = myRoute.steps.map((step: Step) => step.distance?.value || 0);
        instructions = myRoute.steps.map((step: Step) => step.instructions || '');
        setDistances(distances);
        setInstructions(instructions);
    };

    useEffect(() => {
        initMap(gtpData, dataActivityDay, dataRouteActivity)
    }, [gtpData, dataActivityDay, dataRouteActivity, jenisnya])

    return (
        <div className="relative">
            <div ref={legendRef} className={`absolute bottom-6 left-2 `} style={{ zIndex: 100 }}>
                {showLegend && (
                    <div className="legend-content" style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
                        <Legend />
                    </div>
                )}
            </div>
            <div ref={mapRef} className="text-slate-700 h-[400px] md:h-[500px] rounded-lg"></div>
        </div>
    )
}