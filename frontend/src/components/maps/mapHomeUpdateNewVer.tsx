'use client'

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../../../libs/useAxiosAuth";
import { createRoot } from 'react-dom/client';
import { fetchGeomGtp, fetchListAllObject } from "@/app/(pages)/api/fetchers/gtp";
import { fetchEstuaryGeom, fetchListVillage, fetchUlakanVillage } from "@/app/(pages)/api/fetchers/vilage";
import { fetchListGeomKec, fetchListGeomKotaKab } from "@/app/(pages)/api/fetchers/kotaKabKec";
import CustomScale, {
    MapContentCulinaryPlaces, MapContentWorshipPlaces, MapContentSouvenirPlaces,
    MapContentHomestayPlaces, Legend, MapContentGeneral, MapContentAttraction,
    GtpInfoWindow, MapContentBrowseCulinaryPlaces, MapContentBrowseWorshipPlaces,
    MapContentBrowseSouvenirPlaces, MapContentBrowseHomestayPlaces,
    MapContentBrowseAttraction
} from "./mapHelper"; // Sesuaikan path jika mapHelper ada di folder lain

interface UserLocation {
    lat: number;
    lng: number;
}

interface MapType {
    uniqueAttraction: boolean;
    attraction: boolean;
    culinaryPlaces: boolean;
    homestay: boolean;
    souvenirPlaces: boolean;
    worshipPlaces: boolean;
}

interface dataListGeom {
    id: string;
    name: string;
    address?: string;
    contact_person?: string | null;
    capacity?: number | null;
    status?: number | null;
    lat: number;
    lng: number;
    geom?: string;
    type?: string; // Menambahkan type untuk memfilter objek
    type_attr?: string;
    price?: number;
}

interface MapExploreUlakanProps {
    userLocation: UserLocation | null;
    dataMapforType: dataListGeom[] | null;
    radius?: number | null;
    objectAround: MapType | null;
    isManualLocation: boolean;
    setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>;
    setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
    distances: number[];
    instructions: string[];
    setDistances: React.Dispatch<React.SetStateAction<number[]>>;
    setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
    showLegend: boolean;
    dayActivities: any[]; // Pertimbangkan tipe yang lebih spesifik jika memungkinkan
    traffic: boolean;
    browsePlace: boolean;
    object: {
        uniqueAttraction: boolean;
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
    };
    reachToObject: boolean;
    selectActivities: { start: any; end: any } | null;
    goToObject: boolean;
    setGoToObject: React.Dispatch<React.SetStateAction<boolean>>;
    showLabels: boolean;
    setShowLabels: (value: boolean) => void;
    showTerrain: boolean;
    setShowTerrain: (value: boolean) => void;
    setBrowseId: React.Dispatch<React.SetStateAction<string | null>>;
    setBrowseName: React.Dispatch<React.SetStateAction<string | null>>;
    activeMapMode: 'none' | 'browse' | 'radius' | 'route';
    setActiveMapMode: React.Dispatch<React.SetStateAction<'none' | 'browse' | 'radius' | 'route'>>;
    isTravelPlanning: boolean; // <<< NEW
    onWaypointAdded?: (w: { id:string; name:string; lat:number; lng:number }) => void;
    planningWaypoints?: { id:string; name:string; lat:number; lng:number }[]; // << NEW
    planningStart: UserLocation | null; // <-- TERIMA PROP BARU
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

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly'
});

const defaultMapCenter = {
    lat: -0.7102134517843606,
    lng: 100.19420485758688
};

interface GeoJsonConfigItem {
    key: string;
    visible: boolean;
    urls?: string[]; // 'urls' sekarang opsional
    data?: any; // 'data' sekarang opsional
    style: google.maps.Data.StyleOptions;
    featureProps?: (item: any) => { id?: string; name?: string; geometry: any };
    onClick?: (event: google.maps.Data.MouseEvent) => void;
}

const createMapMarker = (
    map: google.maps.Map,
    position: google.maps.LatLngLiteral,
    iconPath: string,
    title: string,
    contentComponent: React.ReactElement,
    infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>
) => {
    const marker = new google.maps.Marker({
        position,
        map,
        title,
        animation: google.maps.Animation.DROP,
        icon: {
            url: iconPath,
        }
    });

    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(contentComponent);

    marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1700);
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        const newInfoWindow = new google.maps.InfoWindow({
            content: container,
        });
        newInfoWindow.open(map, marker);
        infoWindowRef.current = newInfoWindow; // Simpan referensi ke InfoWindow yang baru dibuka
    });
    return marker;
};

const createTextOverlay = (map: google.maps.Map, position: google.maps.LatLngLiteral, stepsHtml: string) => {
    const overlay = new google.maps.OverlayView();
    let div: HTMLElement | null = null;

    overlay.onAdd = function () {
        div = document.createElement('div');
        div.style.cssText = 'position:absolute; font-size:14px; font-weight:bold; color:black; background:white; padding:10px; border-radius:5px; box-shadow:0 2px 6px rgba(0, 0, 0, 0.3); z-index:100;';
        div.innerHTML = stepsHtml;
        this.getPanes()?.overlayLayer.appendChild(div);
    };

    overlay.draw = function () {
        const projection = this.getProjection();
        const positionPixel = projection.fromLatLngToDivPixel(position);
        if (div && positionPixel) {
            div.style.left = `${positionPixel.x}px`;
            div.style.top = `${positionPixel.y}px`;
        }
    };

    overlay.onRemove = function () {
        if (div) {
            div.parentNode?.removeChild(div);
            div = null;
        }
    };
    overlay.setMap(map); // Pasang overlay ke peta

    // Mengembalikan fungsi cleanup yang akan menghapus overlay
    return () => {
        overlay.setMap(null); // Ini akan memicu onRemove internal
    };
};
const animateFlight = (map: google.maps.Map, from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    const airplaneMarker = new google.maps.Marker({
        map: map,
        position: from,
        icon: { url: '/icon/airplane-icon.png', scaledSize: new google.maps.Size(60, 60), anchor: new google.maps.Point(25, 25) },
        title: 'Flight',
    });
    let step = 0;
    const totalSteps = 100;
    const intervalId = setInterval(() => {
        if (step <= totalSteps) {
            const lat = from.lat + (to.lat - from.lat) * (step / totalSteps);
            const lng = from.lng + (to.lng - from.lng) * (step / totalSteps);
            airplaneMarker.setPosition({ lat, lng });
            step++;
        } else {
            clearInterval(intervalId);
            airplaneMarker.setMap(null); // Hapus marker setelah animasi selesai
        }
    }, 50);
    return () => { clearInterval(intervalId); airplaneMarker.setMap(null); }; // Fungsi cleanup
};
const animateCar = (map: google.maps.Map, from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    const carIcon = {
        url: '/icon/car.png',
        scaledSize: new google.maps.Size(60, 40),
        anchor: new google.maps.Point(20, 20),
    };
    const carMarker = new google.maps.Marker({
        position: from,
        map: map,
        icon: carIcon,
        title: 'Car Journey',
        zIndex: 1000,
    });
    let step = 0;
    const totalSteps = 100;
    const intervalId = setInterval(() => {
        if (step <= totalSteps) {
            const lat = from.lat + (to.lat - from.lat) * (step / totalSteps);
            const lng = from.lng + (to.lng - from.lng) * (step / totalSteps);
            carMarker.setPosition({ lat, lng });
            step++;
        } else {
            clearInterval(intervalId);
            carMarker.setMap(null); // Hapus marker setelah animasi selesai
        }
    }, 50);
    return () => { clearInterval(intervalId); carMarker.setMap(null); }; // Fungsi cleanup
};

const useGoogleMap = (mapRef: React.RefObject<HTMLDivElement>) => {
    const googleMap = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        const init = async () => {
            if (mapRef.current && !googleMap.current) { // Hanya inisialisasi jika belum ada
                const { Map } = await loader.importLibrary('maps');
                googleMap.current = new Map(mapRef.current, {
                    center: defaultMapCenter,
                    zoom: 6,
                    mapTypeId: 'satellite', // Default: satellite
                    // disableDefaultUI: true,
                    // scaleControl: true,
                    // scaleControlOptions: {
                    //     position: google.maps.ControlPosition.BOTTOM_LEFT // Skala muncul di kiri bawah
                    // },
                    styles: [{ featureType: "all", elementType: "labels", stylers: [{ "visibility": "off" }] }] // Default: labels off
                });
                infoWindowRef.current = new google.maps.InfoWindow(); // Inisialisasi InfoWindow global
            }
        };
        init();
    }, [mapRef]); // Dependensi hanya pada mapRef, memastikan ini berjalan sekali saat mount

    return { map: googleMap.current, infoWindowRef };
};

const useGeoJsonLayers = (
    map: google.maps.Map | null, visibility: MapExploreUlakanProps['visibility'], 
    infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>,
    setCursorCoord: (coord: { lat: number; lng: number } | null) => void
) => {
    const dataLayersRef = useRef<Record<string, google.maps.Data>>({});
    const gtpMarkerRef = useRef<google.maps.Marker | null>(null);
    const kotaKabData = useQuery({ queryKey: ['kotaKab'], queryFn: fetchListGeomKotaKab, refetchOnWindowFocus: false });
    const kecData = useQuery({ queryKey: ['kec'], queryFn: fetchListGeomKec, refetchOnWindowFocus: false });
    const villageData = useQuery({ queryKey: ['village'], queryFn: fetchListVillage, refetchOnWindowFocus: false });
    const gtpData = useQuery({ queryKey: ['geomGtp'], queryFn: fetchGeomGtp, refetchOnWindowFocus: false });
    const ulakanVillageData = useQuery({ queryKey: ['ulakanVillage'], queryFn: fetchUlakanVillage, refetchOnWindowFocus: false });
    const geomEstuary = useQuery({ queryKey: ['geomEstuary'], queryFn: fetchEstuaryGeom, refetchOnWindowFocus: false });

    const loadAndRenderGeoJson = useCallback(async (
        layerKey: string,
        dataInput: string[] | any[] | undefined, // Ubah nama parameter & tambahkan 'undefined'
        styleOptions: google.maps.Data.StyleOptions,
        featureProps?: (item: any) => { id?: string; name?: string; geometry: any },
        onClick?: (event: google.maps.Data.MouseEvent) => void
    ) => {
        if (!map || !infoWindowRef.current || dataInput === undefined) return; // Tambah cek undefined

        let dataLayer = dataLayersRef.current[layerKey];
        if (!dataLayer) {
            dataLayer = new google.maps.Data();
            dataLayer.setStyle(styleOptions);
            if (onClick) {
                dataLayer.addListener('click', onClick);
            }
            dataLayersRef.current[layerKey] = dataLayer;
        }

        dataLayer.forEach(feature => dataLayer.remove(feature));
        dataLayer.addListener('mousemove', (e: google.maps.Data.MouseEvent) => {
            if (e.latLng) {
                // Update state koordinat dari layer daratan
                setCursorCoord({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                });
            }
        });

        // Perbaiki penanganan tipe di sini
        if (typeof dataInput[0] === 'string') { // Jika elemen pertama adalah string, asumsikan itu array URL
            const urls = dataInput as string[]; // Cast ke string[]
            for (const url of urls) {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    dataLayer.addGeoJson(data);
                } catch (error) {
                    console.error(`Error loading ${url}:`, error);
                }
            }
        } else if (Array.isArray(dataInput)) { // Jika ini array objek (dari useQuery)
            const dataArray = dataInput as any[]; // Cast ke any[] atau tipe yang lebih spesifik
            dataArray.forEach(item => {
                const feature = featureProps ? { type: 'Feature', properties: featureProps(item), geometry: item.geom } : { type: 'Feature', geometry: item.geom };
                dataLayer.addGeoJson(feature);
            });
        }
        
        dataLayer.setMap(map);
    }, [map, infoWindowRef]); // Dependensi untuk useCallback

    // Efek utama untuk mengelola visibilitas dan data setiap layer GeoJSON
    useEffect(() => {
        const countrySources = [
            { url: 'maps/N01.geojson', color: '#FF65A3' }, // Merah Bata
            { url: 'maps/N02.geojson', color: '#7E3AF2' }, // Hijau Neon
            { url: 'maps/N03.geojson', color: '#ffffff' }, // putih transparan
            { url: 'maps/N06.geojson', color: '#FFC107' }, // Kuning
            ];
        const countryConfigs = countrySources.map((source, index) => {
            // Cek apakah ini Indonesia (N03)?
            const isIndonesia = source.url === 'maps/N03.geojson';

            return {
                key: `country_${index}`,
                visible: visibility.country,
                urls: [source.url],
                style: { 
                    fillColor: source.color, 
                    strokeWeight: 0.6, 
                    strokeColor: '#ffffff', // Warna garis pinggir tetap putih
                    
                    // --- BAGIAN PENTING DI SINI ---
                    // Kalau Indonesia, opacity 0 (tembus pandang). Kalau bukan, 0.6.
                    fillOpacity: isIndonesia ? 0.0 : 0.6, 
                    
                    clickable: true, 
                    zIndex: 1 
                },
                onClick: (event: google.maps.Data.MouseEvent) => {
                    infoWindowRef.current?.setContent(`Country ${event.feature.getProperty('name')}`);
                    infoWindowRef.current?.setPosition(event.latLng);
                    infoWindowRef.current?.open(map);
                }
            };
        });
        const geoJsonConfig: GeoJsonConfigItem[] = [
        //   {
        //     key: 'country',
        //     visible: visibility.country,
        //     urls: ['maps/N01.geojson', 'maps/N02.geojson', 'maps/N03.geojson', 'maps/N06.geojson'],
        //     style: { fillColor: '#ffffff', strokeWeight: 0.6, strokeColor: '#ffffff', fillOpacity: 0.05, clickable: true, zIndex: 1 },
        //     onClick: (event: google.maps.Data.MouseEvent) => {
        //         infoWindowRef.current?.setContent(`Country ${event.feature.getProperty('name')}`);
        //         infoWindowRef.current?.setPosition(event.latLng);
        //         infoWindowRef.current?.open(map);
        //     }
        // },
        ...countryConfigs,
        {
            key: 'province',
            visible: visibility.province,
            urls: ['maps/P01.geojson', 'maps/P02.geojson', 'maps/P03.geojson', 'maps/P04.geojson', 'maps/P05.geojson', 'maps/P06.geojson', 'maps/P07.geojson', 'maps/P08.geojson', 'maps/P09.geojson', 'maps/P10.geojson'],
            style: { fillColor: '#ffffff', strokeWeight: 0.5, strokeColor: '#ffffff', fillOpacity: 0.05, clickable: true, zIndex: 2 },
            onClick: (event: google.maps.Data.MouseEvent) => {
                infoWindowRef.current?.setContent(`Provinsi ${event.feature.getProperty('name')}`);
                infoWindowRef.current?.setPosition(event.latLng);
                infoWindowRef.current?.open(map);
            }
        },
        {
            key: 'cityRegency',
            visible: visibility.cityRegency,
            data: kotaKabData.data,
            style: { fillColor: '#ffffff', strokeWeight: 0.5, strokeColor: '#ffffff', fillOpacity: 0.05, clickable: true, zIndex: 3 },
            // PERBAIKI INI: Sertakan 'geometry'
            featureProps: (item: any) => ({ id: item.id, name: item.name, geometry: item.geom }),
            onClick: (event: google.maps.Data.MouseEvent) => { infoWindowRef.current?.setContent(`${event.feature.getProperty('name')}, Sumatera Barat`); infoWindowRef.current?.setPosition(event.latLng); infoWindowRef.current?.open(map); }
        },
        {
            key: 'district',
            visible: visibility.district,
            data: kecData.data,
            style: { fillColor: '#ffffff', strokeWeight: 0.4, strokeColor: '#ffffff', fillOpacity: 0.05, clickable: true, zIndex: 4 },
            // PERBAIKI INI: Sertakan 'geometry'
            featureProps: (item: any) => ({ id: item.id, name: item.name, geometry: item.geom }),
            onClick: (event: google.maps.Data.MouseEvent) => { infoWindowRef.current?.setContent(`Kecamatan ${event.feature.getProperty('name')}`); infoWindowRef.current?.setPosition(event.latLng); infoWindowRef.current?.open(map); }
        },
        {
            key: 'village',
            visible: visibility.village,
            data: villageData.data,
            style: { fillColor: '#ffffff', strokeWeight: 0.5, strokeColor: '#ffffff', fillOpacity: 0.05, clickable: true, zIndex: 5 },
            // PERBAIKI INI: Sertakan 'geometry'
            featureProps: (item: any) => ({ id: item.id, name: item.name, geometry: item.geom }),
            onClick: (event: google.maps.Data.MouseEvent) => { infoWindowRef.current?.setContent(`Desa ${event.feature.getProperty('name')}`); infoWindowRef.current?.setPosition(event.latLng); infoWindowRef.current?.open(map); }
        },
            {
                key: 'gtp',
                visible: true, // Berdasarkan kode lamamu, GTP selalu terlihat
                data: gtpData.data,
                style: { fillColor: '#03C988', strokeWeight: 1, strokeColor: '#ffffff', fillOpacity: 0.4, clickable: false, zIndex: 6 },
            },
            {
                key: 'ulakanVillage',
                visible: true,
                data: ulakanVillageData.data,
                style: { fillColor: '#FFD700', strokeWeight: 0.1, strokeColor: '#FF0000', fillOpacity: 0.05, clickable: false, zIndex: 5 },
            },
            {
                key: 'estuary',
                visible: true,
                data: geomEstuary.data,
                style: { fillColor: '#A0522D', strokeWeight: 2, strokeColor: '#8B4513', fillOpacity: 0.8, clickable: false, zIndex: 0 },
            }
        ];

        geoJsonConfig.forEach(config => {
            const dataToLoad = config.urls || config.data;
            if (config.visible && dataToLoad) {
                loadAndRenderGeoJson(
                    config.key,
                    dataToLoad,
                    config.style,
                    config.featureProps,
                    config.onClick
                );
            } else {
                // Sembunyikan dan hapus fitur jika tidak visible
                if (dataLayersRef.current[config.key]) {
                    dataLayersRef.current[config.key].setMap(null);
                    dataLayersRef.current[config.key].forEach(feature => dataLayersRef.current[config.key].remove(feature));
                }
            }
        });

    }, [map, visibility, kotaKabData.data, kecData.data, villageData.data, gtpData.data, ulakanVillageData.data, geomEstuary.data, loadAndRenderGeoJson, infoWindowRef]);

    // Cleanup function untuk menghapus semua data layers saat komponen unmount
    useEffect(() => {
        return () => {
            Object.values(dataLayersRef.current).forEach(dataLayer => {
                dataLayer.setMap(null);
                dataLayer.forEach(feature => dataLayer.remove(feature));
            });
        };
    }, []);

    useEffect(() => {
    if (!map || !infoWindowRef.current || gtpMarkerRef.current) return; // Hanya buat jika belum ada

    const markerGTPPosition = defaultMapCenter; // Asumsi posisi GTP statis

    const marker = createMapMarker(
        map,
        markerGTPPosition,
        '/icon/gtp.png',
        'GTP Location',
        <GtpInfoWindow />,
        infoWindowRef
    );
    gtpMarkerRef.current = marker; // Simpan referensi marker

    // Cleanup function untuk menghapus marker GTP saat unmount
    return () => {
        if (gtpMarkerRef.current) {
            gtpMarkerRef.current.setMap(null);
            gtpMarkerRef.current = null; // Penting: Reset ref setelah dihapus
        }
    };
}, [map, infoWindowRef]);
};

const useObjectMarkers = (
    map: google.maps.Map | null,
    objectVisibility: MapExploreUlakanProps['object'],
    dataListAllObject: any, // Pertimbangkan tipe yang lebih spesifik
    browsePlace: boolean,
    setBrowseId: (id: string | null) => void,
    setBrowseName: (name: string | null) => void,
    handleRouteButtonClick: (lat: number, lng: number) => void,
    infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>,
    activeMapMode: 'none' | 'browse' | 'radius' | 'route', // Mode peta aktif saat ini
    isTravelPlanning: boolean,   // <<< NEW
    onAddToRoute: (wp: { id:string; name:string; lat:number; lng:number }) => void // <<< NEW
) => {
    const objectMarkersRef = useRef<Record<string, google.maps.Marker>>({});
    const objectPolygonsRef = useRef<Record<string, google.maps.Polygon>>({});

    const clearMarkers = useCallback(() => {
        Object.values(objectMarkersRef.current).forEach(marker => marker.setMap(null));
        objectMarkersRef.current = {};
    }, []);

    const clearPolygons = useCallback(() => {
        Object.values(objectPolygonsRef.current).forEach(polygon => polygon.setMap(null));
        objectPolygonsRef.current = {};
    }, []);

    useEffect(() => {
        if (!map) return;
        // if (activeMapMode !== 'browse') {
        //     clearMarkers();
        //     clearPolygons();
        // }
        const showBrowseLayer = activeMapMode === 'browse' || activeMapMode === 'none';
        if (!showBrowseLayer) {
            // kalau pindah ke route/radius/dll -> beresin semua marker/polygon browse
            clearMarkers();
            clearPolygons();
        }
    }, [activeMapMode, map, clearMarkers, clearPolygons]);

    // if (activeMapMode === 'route' || activeMapMode === 'radius') {
    //     clearMarkers()
    // }
    const handleBrowseRespond = useCallback((id: string, name: string) => {
        setBrowseId(id);
        setBrowseName(name);
    }, [setBrowseId, setBrowseName]);


    // Callback untuk menambahkan/memperbarui marker objek berdasarkan tipe
    const addOrUpdateObjectMarkers = useCallback((type: string, iconPath: string, MapContentComponent: React.FC<any>) => {        
        if (!map || !dataListAllObject) return;

        const filteredData = dataListAllObject.filter((item: { type: string }) => item.type === type);
        
        const currentMarkers = objectMarkersRef.current;
        const currentPolygons = objectPolygonsRef.current; // Ambil referensi polygon
        const newBounds = new google.maps.LatLngBounds();
        const activeIds = new Set<string>();

        filteredData.forEach((item: any) => {
            activeIds.add(item.id);
            if (!currentMarkers[item.id]) {
                const marker = createMapMarker(
                    map,
                    { lat: item.lat, lng: item.lng },
                    iconPath,
                    item.name,
                    <MapContentComponent
                        id={item.id} name={item.name} contact_person={item.contact_person}
                        lat={item.lat} lng={item.lng} address={item.address} capacity={item.capacity}
                        type={item.type_attr} price={item.price} explore={0}
                        onRouteClick={handleRouteButtonClick} browse={browsePlace}
                        onBrowseRespond={handleBrowseRespond}
                        onAddToRoute={
                            isTravelPlanning
                            ? () => onAddToRoute({ id: item.id, name: item.name, lat: item.lat, lng: item.lng })
                            : undefined           // <<< saat BUKAN planning, tidak ada tombol +Add
                        }
                    />,
                    infoWindowRef
                );
                currentMarkers[item.id] = marker;
            } else {
                currentMarkers[item.id].setPosition({ lat: item.lat, lng: item.lng });
                currentMarkers[item.id].setMap(map); // Pastikan marker masih di peta
            }
            newBounds.extend({ lat: item.lat, lng: item.lng });
            if (item.geom && item.geom.type === 'MultiPolygon' && item.geom.coordinates && item.geom.coordinates.length > 0) {
                if (!currentPolygons[item.id]) {
                    // Jika polygon belum ada, buat yang baru
                    const paths: google.maps.LatLngLiteral[][] = [];
                    item.geom.coordinates.forEach((polygonCoords: any[][]) => {
                        polygonCoords.forEach((ring: any[]) => {
                            const path = ring.map((coord: number[]) => ({
                                lng: coord[0],
                                lat: coord[1],
                            }));
                            paths.push(path);
                        });
                    });

                    const polygon = new google.maps.Polygon({
                        paths: paths,
                        strokeColor: '#FF0000', // Warna garis polygon
                        strokeOpacity: 0.1,
                        strokeWeight: 0.1,
                        fillColor: '#FF0000', // Warna isi polygon
                        fillOpacity: 0.2,
                        map: map,
                    });
                    currentPolygons[item.id] = polygon;
                } else {
                    // Jika polygon sudah ada, pastikan tetap di peta
                    currentPolygons[item.id].setMap(map);
                }
            } else {
                // Jika data tidak memiliki geom atau tipe bukan MultiPolygon, pastikan polygon dihapus jika sebelumnya ada
                if (currentPolygons[item.id]) {
                    currentPolygons[item.id].setMap(null);
                    delete currentPolygons[item.id];
                }
            }
        });
        map.setCenter({ lat: -0.698464, lng: 100.198527 }); // Set pusat peta ke koordinat yang diminta
        map.setZoom(15); // Set zoom ke level 15
    }, [map, dataListAllObject, browsePlace, handleRouteButtonClick, handleBrowseRespond, infoWindowRef, isTravelPlanning, onAddToRoute ]);

    // Efek untuk mengaktifkan/menonaktifkan marker kategori objek
    useEffect(() => {
        // if (activeMapMode !== 'browse') return;  // guard
        const showBrowseLayer = activeMapMode === 'browse' || activeMapMode === 'none';
        if (!showBrowseLayer) return;   // guard
        const currentMarkers = objectMarkersRef.current; // Ambil referensi current markers
        const currentPolygons = objectPolygonsRef.current; // Ambil referensi polygon
        const newActiveObjectIds = new Set<string>(); // Set untuk ID objek yang SEHARUSNYA aktif

        // Fungsionalitas untuk setiap tipe objek
        if (objectVisibility.attraction) {            
            // addOrUpdateObjectMarkers('A', '/icon/attraction.png', MapContentAttraction);
            addOrUpdateObjectMarkers('A', '/icon/attraction.png', MapContentBrowseAttraction);
            // Tambahkan ID dari objek atraksi yang aktif ke newActiveObjectIds
            dataListAllObject?.filter((item: { type: string; category?: number | string }) =>
                 item.type === 'A' && Number(item.category) === 0).forEach((item: any) => newActiveObjectIds.add(item.id));
        }
        if (objectVisibility.uniqueAttraction) {            
            // addOrUpdateObjectMarkers('A', '/icon/attraction.png', MapContentAttraction);
            addOrUpdateObjectMarkers('A', '/icon/attraction.png', MapContentBrowseAttraction);
            // Tambahkan ID dari objek atraksi yang aktif ke newActiveObjectIds
            dataListAllObject
                ?.filter((item: { type: string; category?: number | string }) =>
                item.type === 'A' && Number(item.category) === 1
                )
                .forEach((item: any) => newActiveObjectIds.add(item.id));
        }
        if (objectVisibility.culinaryPlace) {
            addOrUpdateObjectMarkers('CP', '/icon/culinary.png', MapContentBrowseCulinaryPlaces);
            dataListAllObject?.filter((item: { type: string }) => item.type === 'CP').forEach((item: any) => newActiveObjectIds.add(item.id));
        }
        if (objectVisibility.worshipPlace) {
            addOrUpdateObjectMarkers('WP', '/icon/worship.png', MapContentBrowseWorshipPlaces);
            dataListAllObject?.filter((item: { type: string }) => item.type === 'WP').forEach((item: any) => newActiveObjectIds.add(item.id));
        }
        if (objectVisibility.souvenirPlace) {
            addOrUpdateObjectMarkers('SP', '/icon/souvenir.png', MapContentBrowseSouvenirPlaces);
            dataListAllObject?.filter((item: { type: string }) => item.type === 'SP').forEach((item: any) => newActiveObjectIds.add(item.id));
        }
        if (objectVisibility.homestay) {
            addOrUpdateObjectMarkers('HO', '/icon/homestay.png', MapContentBrowseHomestayPlaces);
            dataListAllObject?.filter((item: { type: string }) => item.type === 'HO').forEach((item: any) => newActiveObjectIds.add(item.id));
        }

        // --- BARU DI SINI KITA HAPUS MARKER YANG TIDAK LAGI AKTIF ---
        Object.keys(currentMarkers).forEach(id => {
            if (!newActiveObjectIds.has(id)) {
                // Jika ID marker tidak ada lagi di daftar yang aktif, hapus dari peta
                currentMarkers[id].setMap(null);
                delete currentMarkers[id]; // Hapus referensi dari ref
            }
        });
        Object.keys(currentPolygons).forEach(id => {
            if (!newActiveObjectIds.has(id)) {
                currentPolygons[id].setMap(null);
                delete currentPolygons[id];
            }
        });
    }, [objectVisibility, dataListAllObject, map, browsePlace, addOrUpdateObjectMarkers, activeMapMode])

    useEffect(() => {
        return () => {
            clearMarkers();
            clearPolygons(); // Pastikan polygon juga dibersihkan saat unmount
        };
    }, [clearMarkers, clearPolygons]);

    // Cleanup: hapus semua marker saat komponen unmount
    useEffect(() => {
        return () => {
            Object.values(objectMarkersRef.current).forEach(marker => marker.setMap(null));
            objectMarkersRef.current = {};
        };
    }, []);
};

const useUserLocationAndRadiusYangLama = (
    map: google.maps.Map | null,
    userLocation: UserLocation | null,
    radius: number | null | undefined,
    objectAround: MapType | null,
    infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>,
    handleRouteButtonClick: (lat: number, lng: number) => void
) => {
    const locationMarkerRef = useRef<google.maps.Marker | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const objectMarkersAroundRef = useRef<Record<string, google.maps.Marker>>({});

    const generateMarkerAround = useCallback((item: dataListGeom, icon: string, MapContentComponent: React.FC<any>) => {
        if (!map || !infoWindowRef.current) return;        
        const marker = createMapMarker(
            map,
            { lat: item.lat, lng: item.lng },
            `/icon/${icon}.png`,
            item.name || '',
            <MapContentComponent
                id={item.id} name={item.name} address={item.address}
                contact_person={item.contact_person} capacity={item.capacity}
                lat={item.lat} lng={item.lng} onRouteClick={handleRouteButtonClick}
                type={item?.type}
            />,
            infoWindowRef
        );
        objectMarkersAroundRef.current[item.id] = marker;
    }, [map, infoWindowRef, handleRouteButtonClick]);

    useEffect(() => {
        if (!map || !userLocation) return;

        // Bersihkan marker lokasi pengguna dan lingkaran radius yang sudah ada
        if (locationMarkerRef.current) locationMarkerRef.current.setMap(null);
        if (circleRef.current) circleRef.current.setMap(null);

        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        const myLocationContent = `
            <div style="padding:4px; color:black; text-align:center;">
                <p style="font-weight:bold; margin-bottom:4px;">You Are Here</p>
                <p style="font-size:12px; margin:0;">
                Lat: ${userLocation.lat.toFixed(6)} <br/>
                Lng: ${userLocation.lng.toFixed(6)}
                </p>
            </div>
            `;

        // Buat marker lokasi pengguna yang baru
        const newMarkerLocation = new google.maps.Marker({
            position: userLocation,
            map: map,
            animation: google.maps.Animation.DROP,
        });

        if (infoWindowRef.current) {
            infoWindowRef.current.setContent(myLocationContent);
            infoWindowRef.current.open(map, newMarkerLocation);
        } else {
            const tempInfoWindow = new google.maps.InfoWindow({ content: myLocationContent });
            tempInfoWindow.open(map, newMarkerLocation);
            infoWindowRef.current = tempInfoWindow;
        }

        newMarkerLocation.addListener('click', () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.setContent(myLocationContent);
                infoWindowRef.current.open(map, newMarkerLocation);
            }
        });

        locationMarkerRef.current = newMarkerLocation;
        map.panTo(userLocation);

        // --- KEMBALIKAN BLOK INI ---
        if (radius !== null && radius !== undefined) {
            // console.log('Radius is active:', radius); // Tambahkan log untuk konfirmasi
            const circle = new google.maps.Circle({
                map: map,
                center: userLocation,
                radius: radius,
                fillColor: '#AA0000',
                fillOpacity: 0.3,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                zIndex: 100
            });
            circleRef.current = circle;

            Object.values(objectMarkersAroundRef.current).forEach(marker => marker.setMap(null));
            objectMarkersAroundRef.current = {};

            const fetchObjectsByRadius = async () => {
                const { lat, lng } = userLocation;
                const requests = [];
                if (objectAround?.culinaryPlaces) requests.push(useAxiosAuth.get(`/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
                if (objectAround?.worshipPlaces) requests.push(useAxiosAuth.get(`/worship/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
                if (objectAround?.souvenirPlaces) requests.push(useAxiosAuth.get(`/souvenir/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
                if (objectAround?.homestay) requests.push(useAxiosAuth.get(`/homestay/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
                if (objectAround?.attraction) requests.push(useAxiosAuth.get(`/attraction/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));

                try {
                    const responses = await Promise.all(requests);
                    responses.forEach(res => {
                        if (res?.data?.data) {
                            res.data.data.forEach((item: dataListGeom) => {                                
                                if (item.id.startsWith("CP")) generateMarkerAround(item, 'culinary', MapContentCulinaryPlaces);
                                else if (item.id.startsWith("WP")) generateMarkerAround(item, 'worship', MapContentWorshipPlaces);
                                else if (item.id.startsWith("SP")) generateMarkerAround(item, 'souvenir', MapContentSouvenirPlaces);
                                else if (item.id.startsWith("HO")) generateMarkerAround(item, 'homestay', MapContentHomestayPlaces);
                                else if (item.id.startsWith("A")) generateMarkerAround(item, 'attraction', MapContentAttraction);
                            });
                        }
                    });
                } catch (error) {
                    console.error("Error fetching objects by radius:", error);
                }
            };
            fetchObjectsByRadius();
        }

        return () => {
            if (locationMarkerRef.current) locationMarkerRef.current.setMap(null);
            if (circleRef.current) circleRef.current.setMap(null);
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            Object.values(objectMarkersAroundRef.current).forEach(marker => marker.setMap(null));
            objectMarkersAroundRef.current = {};
        };
    }, [map, userLocation, radius, objectAround, generateMarkerAround, infoWindowRef, handleRouteButtonClick]);
};
const useUserLocationAndRadius = (
  map: google.maps.Map | null,
  userLocation: UserLocation | null,
  radius: number | null | undefined,
  objectAround: MapType | null,
  infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>,
  handleRouteButtonClick: (lat: number, lng: number) => void,
  isTravelPlanning?: boolean, // <<< NEW
  onAddToRoute?: (w: { id:string; name:string; lat:number; lng:number }) => void // <<< NEW
) => {    
  const locationMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const objectMarkersAroundRef = useRef<Record<string, google.maps.Marker>>({});
  const requestIdRef = useRef(0); // <<< penanda batch aktif

  const clearAroundMarkers = useCallback(() => {
    Object.values(objectMarkersAroundRef.current).forEach(m => m.setMap(null));
    objectMarkersAroundRef.current = {};
  }, []);

  const generateMarkerAround = useCallback((item: dataListGeom, icon: string, MapContentComponent: React.FC<any>) => {
    if (!map || !infoWindowRef.current) return;
    
    const marker = createMapMarker(
      map,
      { lat: item.lat, lng: item.lng },
      `/icon/${icon}.png`,
      item.name || '',
      <MapContentComponent
        id={item.id} name={item.name} address={item.address}
        contact_person={item.contact_person} capacity={item.capacity}
        lat={item.lat} lng={item.lng} onRouteClick={handleRouteButtonClick}
        type={item?.type} 
        price={item?.price}
        onAddToRoute={
        isTravelPlanning
          ? () => onAddToRoute?.({ id: item.id, name: item.name, lat: item.lat, lng: item.lng })
          : undefined
        }

      />,
      infoWindowRef
    );
    objectMarkersAroundRef.current[item.id] = marker;
  }, [map, infoWindowRef, handleRouteButtonClick, isTravelPlanning]);

  useEffect(() => {
    if (!map || !userLocation) return;

    // Bersihkan lokasi & circle lama
    locationMarkerRef.current?.setMap(null);
    circleRef.current?.setMap(null);
    infoWindowRef.current?.close();

    const myLocationContent = `
            <div style="padding:4px; color:black; text-align:center;">
                <p style="font-weight:bold; margin-bottom:4px;">You Are Here</p>
                <p style="font-size:12px; margin:0;">
                Lat: ${userLocation.lat.toFixed(6)} <br/>
                Lng: ${userLocation.lng.toFixed(6)}
                </p>
            </div>
            `;

    // Marker "You are here"
    const youHere = new google.maps.Marker({
      position: userLocation,
      map,
      animation: google.maps.Animation.DROP,
    });
    if (infoWindowRef.current) {
        infoWindowRef.current.setContent(myLocationContent);
        infoWindowRef.current.open(map, youHere);
    } else {
        infoWindowRef.current = new google.maps.InfoWindow({ content: myLocationContent });
        infoWindowRef.current.open(map, youHere);
    }
    youHere.addListener('click', () => {
        infoWindowRef.current?.setContent(myLocationContent);
        infoWindowRef.current?.open(map, youHere);
    });
    locationMarkerRef.current = youHere;
    map.panTo(userLocation);

    // Tiap perubahan radius = batch baru
    const myBatch = ++requestIdRef.current;

    // Selalu kosongkan marker radius lama saat batch baru mulai
    clearAroundMarkers();

    // Jika radius tidak aktif: selesai
    if (radius === null || radius === undefined || radius <= 0) {
      return () => {
        youHere.setMap(null);
        circleRef.current?.setMap(null);
        clearAroundMarkers();
        infoWindowRef.current?.close();
      };
    }

    // Circle radius
    const circle = new google.maps.Circle({
      map,
      center: userLocation,
      radius,
      fillColor: '#AA0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      zIndex: 100,
      clickable: false,
    });
    circleRef.current = circle;

    // FETCH: boleh cepat-berubah; kita pakai guard batch (tanpa cancel axios)
    (async () => {
      try {
        const { lat, lng } = userLocation;
        console.log('ini di adalah ',userLocation);
        
        const requests: Promise<any>[] = [];
        if (objectAround?.culinaryPlaces) requests.push(useAxiosAuth.get(`/culinary/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
        if (objectAround?.worshipPlaces)  requests.push(useAxiosAuth.get(`/worship/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
        if (objectAround?.souvenirPlaces) requests.push(useAxiosAuth.get(`/souvenir/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
        if (objectAround?.homestay)       requests.push(useAxiosAuth.get(`/homestay/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
        if (objectAround?.attraction)     requests.push(useAxiosAuth.get(`/attraction/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));
        if (objectAround?.uniqueAttraction)     requests.push(useAxiosAuth.get(`/attraction/unique/listByRadius?lat=${lat}&lng=${lng}&radius=${radius}`));

        const responses = await Promise.all(requests);

        // Kalau sudah ada batch baru, abaikan hasil ini (mencegah “nyangkut”)
        if (requestIdRef.current !== myBatch) return;

        responses.forEach(res => {
          const list = res?.data?.data as dataListGeom[] | undefined;
          if (!list) return;
          list.forEach(item => {
            // Cek lagi batch setiap kali mau nambah marker
            if (requestIdRef.current !== myBatch) return;
            if (item.id.startsWith('CP')) generateMarkerAround(item, 'culinary', MapContentCulinaryPlaces);
            else if (item.id.startsWith('WP')) generateMarkerAround(item, 'worship',  MapContentWorshipPlaces);
            else if (item.id.startsWith('SP')) generateMarkerAround(item, 'souvenir', MapContentSouvenirPlaces);
            else if (item.id.startsWith('HO')) generateMarkerAround(item, 'homestay', MapContentHomestayPlaces);
            else if (item.id.startsWith('A'))  generateMarkerAround(item, 'attraction', MapContentAttraction);
          });
        });
      } catch (e) {
        console.error('Error fetching objects by radius:', e);
      }
    })();

    // Cleanup tiap perubahan dependency
    return () => {
      youHere.setMap(null);
      circleRef.current?.setMap(null);
      clearAroundMarkers();
      infoWindowRef.current?.close();
      // Tidak perlu apa-apa untuk request: batch guard sudah cukup menahan respons basi
    };
  }, [map, userLocation, radius, objectAround, generateMarkerAround, infoWindowRef, handleRouteButtonClick, clearAroundMarkers]);
};

const useMapInteraction = (
    map: google.maps.Map | null,
    isManualLocation: boolean,
    setIsManualLocation: React.Dispatch<React.SetStateAction<boolean>>,
    setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>,
    goToObject: boolean,
    setGoToObject: React.Dispatch<React.SetStateAction<boolean>>,
    showLabels: boolean,
    setShowLabels: (value: boolean) => void,
    showTerrain: boolean,
    setShowTerrain: (value: boolean) => void,
    traffic: boolean
) => {
    // Efek untuk mode lokasi manual (klik peta untuk set lokasi)
    useEffect(() => {
        let clickListener: google.maps.MapsEventListener | null = null;
        if (isManualLocation && map) {
            clickListener = map.addListener('click', (mapsMouseEvent: google.maps.MapMouseEvent) => {
                const newLocation = {
                    lat: mapsMouseEvent.latLng?.lat(),
                    lng: mapsMouseEvent.latLng?.lng()
                };
                if (newLocation.lat !== undefined && newLocation.lng !== undefined) {
                    setUserLocation({ lat: newLocation.lat, lng: newLocation.lng });
                }
                setIsManualLocation(false); // Nonaktifkan mode manual setelah satu klik
                if (clickListener) clickListener.remove(); // Hapus listener
            });
        }
        // Cleanup: hapus listener saat mode manual off atau komponen unmount
        return () => {
            if (clickListener) clickListener.remove();
        };
    }, [isManualLocation, map, setUserLocation, setIsManualLocation]);

    // Efek untuk navigasi cepat ke lokasi objek default
    useEffect(() => {
        if (goToObject && map) {
            // map.panTo(defaultMapCenter); // Menggunakan defaultMapCenter
            map.panTo({lat: -0.7069612344853281, lng:100.19544485550248}); // Menggunakan defaultMapCenter
            map.setZoom(16);
            setGoToObject(false); // Reset state
        }
    }, [goToObject, map, setGoToObject]);

    // Efek untuk pengaturan tampilan peta (label, terrain/roadmap)
    useEffect(() => {
        if (map) {
            const styles: google.maps.MapTypeStyle[] = [
                {
                    featureType: 'administrative',
                    elementType: 'labels',
                    stylers: [{ visibility: showLabels ? 'on' : 'off' }],
                },
                {
                    featureType: "all",
                    elementType: "labels",
                    stylers: [{ "visibility": showLabels ? "on" : "off" }] // Ini yang mengontrol label secara global
                }
            ];
            map.setOptions({
                styles: styles, // Menerapkan styles yang diperbarui
                mapTypeId: showTerrain ? 'terrain' : 'satellite', // Mengganti tipe peta
            });
        }
    }, [map, showLabels, showTerrain]);

    // Efek untuk lapisan lalu lintas
    useEffect(() => {
        let trafficLayer: google.maps.TrafficLayer | null = null;
        if (map && traffic) {
            trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        }
        // Cleanup: hapus lapisan lalu lintas saat traffic off atau komponen unmount
        return () => {
            if (trafficLayer) trafficLayer.setMap(null);
        };
    }, [traffic, map]);
};

const useRouteAndAnimations = (
    map: google.maps.Map | null,
    userLocation: UserLocation | null,
    dayActivities: any[], // Perlu tipe yang lebih spesifik
    selectActivities: { start: any; end: any } | null,
    dataListAllObject: any, // Perlu tipe yang lebih spesifik
    setDistances: React.Dispatch<React.SetStateAction<number[]>>,
    setInstructions: React.Dispatch<React.SetStateAction<string[]>>,
    reachToObject: boolean,
    infoWindowRef: React.MutableRefObject<google.maps.InfoWindow | null>,
    activeMapMode: 'none' | 'browse' | 'radius' | 'route' // Mode peta aktif saat ini
) => {    
    const routeRenderersRef = useRef<google.maps.DirectionsRenderer[]>([]);
    const activityMarkersRef = useRef<google.maps.Marker[]>([]);

    const clearAllRoutesAndMarkers = useCallback(() => {
        routeRenderersRef.current.forEach((renderer) => renderer.setMap(null));
        routeRenderersRef.current = [];
        activityMarkersRef.current.forEach(marker => marker.setMap(null));
        activityMarkersRef.current = [];
        setDistances([]);
        setInstructions([]);
    }, [setDistances, setInstructions]);

    const handleRouteButtonClick = useCallback(async (targetLat: number, targetLng: number) => {
        if (!map || !userLocation) return;
        clearAllRoutesAndMarkers();

        const directionsService = new google.maps.DirectionsService();
        const start = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        const end = new google.maps.LatLng(targetLat, targetLng);

        try {
            const result: google.maps.DirectionsResult | null = await directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            });

            if (result && result.routes.length > 0) { // <-- Perbaiki pengecekan di sini
                const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
                directionsRenderer.setDirections(result);
                routeRenderersRef.current.push(directionsRenderer);

                const myRoute = result.routes[0].legs[0];
                setDistances(myRoute.steps.map((step: Step) => step.distance?.value || 0));
                setInstructions(myRoute.steps.map((step: Step) => step.instructions || ''));

                const bounds = new google.maps.LatLngBounds();
                bounds.extend(start);
                bounds.extend(end);
                map.fitBounds(bounds);
            } else {
                // Kasus ketika result null atau tidak ada rute ditemukan (tapi API tidak melempar error)
                console.error("Directions request completed but no routes found.");
            }
        } catch (error: any) { // Tangkap error dengan tipe any atau Error
            // Error di sini berarti ada masalah dengan request itu sendiri (status bukan OK)
            console.error("Error calculating route:", error);
            if (error.code && error.message) { // Contoh: error dari Maps API mungkin punya code/message
                console.error(`Google Maps Directions API error: ${error.code} - ${error.message}`);
            }
        }
    }, [map, userLocation, clearAllRoutesAndMarkers, setDistances, setInstructions]); // Dependensi

    useEffect(() => {
        if (!map || !dataListAllObject) return;
        if (activeMapMode !== 'route') return clearAllRoutesAndMarkers()

        clearAllRoutesAndMarkers(); // Bersihkan rute dan marker aktivitas sebelumnya

        const objectMap = dataListAllObject.reduce((acc: any, obj: any) => {
            acc[obj.id] = { lat: obj.lat, lng: obj.lng, name: obj.name, id: obj.id, address: obj.address, capacity: obj.capacity, contact_person: obj.contact_person, type_attr: obj.type_attr, price: obj.price, type: obj.type };
            return acc;
        }, {});

        // Proses dayActivities (rute multi-titik)
        if (dayActivities.length > 0) {
            const dayActivitiesWithCoordinates = dayActivities.map(activity => ({
                ...activity,
                ...objectMap[activity.object_id]
            })).filter(activity => activity.lat !== null && activity.lng !== null);

            // Tambahkan marker untuk setiap aktivitas di rute
            dayActivitiesWithCoordinates.forEach((activity) => {                
                let iconPath = '';
                switch (activity.type) {
                    case 'EV': iconPath = 'event'; break;
                    case 'CP': iconPath = 'culinary'; break;
                    case 'WP': iconPath = 'worship'; break;
                    case 'HO': iconPath = 'homestay'; break;
                    case 'SP': iconPath = 'souvenir'; break;
                    case 'A': iconPath = 'attraction'; break;
                    default: iconPath = 'default'; // Default icon jika tidak ada
                }
                const marker = createMapMarker(
                    map,
                    { lat: activity.lat, lng: activity.lng },
                    `/icon/${iconPath}.png`,
                    activity.name,
                    <MapContentGeneral
                        id={activity.id} price={activity.price} icon={iconPath} name={activity.name}
                        address={activity.address} capacity={activity.capacity} contact_person={activity.contact_person}
                        lat={activity.lat} lng={activity.lng} onRouteClick={handleRouteButtonClick}
                    />,
                    infoWindowRef
                );
                activityMarkersRef.current.push(marker); // Simpan referensi marker ini
            });

            if (dayActivitiesWithCoordinates.length > 1) {
                const directionsService = new google.maps.DirectionsService();
                const start = new google.maps.LatLng(dayActivitiesWithCoordinates[0].lat, dayActivitiesWithCoordinates[0].lng);
                const end = new google.maps.LatLng(dayActivitiesWithCoordinates[dayActivitiesWithCoordinates.length - 1].lat, dayActivitiesWithCoordinates[dayActivitiesWithCoordinates.length - 1].lng);
                const waypoints = dayActivitiesWithCoordinates.slice(1, -1).map((activity: any) => ({
                    location: new google.maps.LatLng(activity.lat, activity.lng),
                    stopover: true
                }));

                directionsService.route({
                    origin: start,
                    destination: end,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.DRIVING,
                    optimizeWaypoints: false,
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result !== null) {
                        const directionsRenderer = new google.maps.DirectionsRenderer({ map: map, suppressMarkers: true });
                        directionsRenderer.setDirections(result);
                        routeRenderersRef.current.push(directionsRenderer);
                        // Hitung total jarak dan instruksi dari semua leg
                        const totalDistance = result.routes[0].legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
                        const allInstructions: string[] = result.routes[0].legs.flatMap(leg => leg.steps.map(step => step.instructions || ''));
                        setDistances([totalDistance]);
                        setInstructions(allInstructions);
                    } else {
                        console.error("Directions request failed for day activities: " + status);
                    }
                });
            }
        }

        // Proses selectActivities (rute start-end)
        if (selectActivities !== null) {
            let startCoordinates: Coordinates;
            if (selectActivities.start === '0') {
                startCoordinates = { lat: -0.709021, lng: 100.198740 }; // Hardcoded Nagari Ulakan
            } else {
                startCoordinates = objectMap[selectActivities.start] || { lat: null, lng: null };
            }
            const endCoordinates = objectMap[selectActivities.end] || { lat: null, lng: null };

            if (startCoordinates.lat !== null && startCoordinates.lng !== null && endCoordinates.lat !== null && endCoordinates.lng !== null) {
                const directionsService = new google.maps.DirectionsService();
                const start = new google.maps.LatLng(startCoordinates.lat, startCoordinates.lng);
                const end = new google.maps.LatLng(endCoordinates.lat, endCoordinates.lng);
                directionsService.route({
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                }, (result, status) => {
                    if (status === 'OK' && result !== null) {
                        const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
                        directionsRenderer.setDirections(result);
                        routeRenderersRef.current.push(directionsRenderer);
                        const myRoute = result.routes[0].legs[0];
                        setDistances(myRoute.steps.map((step: Step) => step.distance?.value || 0));
                        setInstructions(myRoute.steps.map((step: Step) => step.instructions || ''));
                    } else {
                        console.error("Directions request failed for selected activities: " + status);
                    }
                });
            }
        }
    }, [dayActivities, selectActivities, dataListAllObject, map, clearAllRoutesAndMarkers, setDistances, setInstructions, handleRouteButtonClick, infoWindowRef, activeMapMode]);

    useEffect(() => {
        if (!map || !reachToObject) return;

        // Koordinat statis untuk animasi (bisa dipindahkan ke konstanta global)
        const singapore = { lat: 1.2854190117401771, lng: 103.8198 };
        const malaysia = { lat: 3.1503614007038454, lng: 101.97940881384584 };
        const jakarta = { lat: -6.204170461185947, lng: 106.82277186754867 };
        const padang = { lat: -0.9478502987473912, lng: 100.3628232695202 };
        const bandaAceh = { lat: 5.537368838813003, lng: 95.50780215398227 };
        const nagariUlakan = { lat: -0.7099552023563865, lng: 100.19707985940916 };

        const cleanups: (() => void)[] = []; // Array untuk menyimpan fungsi cleanup

        const roadsLayer = new google.maps.Data();
    
        // Load data jalan yang sudah kita download
        roadsLayer.loadGeoJson('/maps/roads.geojson'); 

        // Pasang Style Keren yang tadi kita bahas
        roadsLayer.setStyle((feature) => {
            const type = feature.getProperty('highway');
            const name = feature.getProperty('name') as string;
            let color = '#ffffff'; 
            let weight = 0.5;
            let zIndex = 1;

            if (type === 'trunk' || type === 'primary') {
                color = '#F59E0B'; // Oranye (Jalan Besar)
                weight = 12;
                zIndex = 10;
            } else if (type === 'secondary' || type === 'tertiary') {
                color = '#FCD34D'; // Kuning
                weight = 8;
                zIndex = 5;
            }

            return {
                strokeColor: color,
                strokeWeight: weight,
                strokeOpacity: 0.8,
                clickable: true, // Biar gak ganggu klik user
                zIndex: zIndex,
                title: name,
            };
        });

        roadsLayer.addListener('click', (event: google.maps.Data.MouseEvent) => {
            const osmID = event.feature.getProperty('@id');
            const name = event.feature.getProperty('name') as string;
            const tipe = event.feature.getProperty('highway') as string;
            console.log("OSM ID (Copy ini):", osmID); // <--- INI KUNCINYA

            // Cek dulu, kalau namanya kosong, ganti jadi strip
            const displayName = name ? name : "Unknown Road";

            // Set isi InfoWindow
            // Kita bisa masukin HTML biar rapi
            infoWindowRef.current?.setContent(`
                <div style="padding:4px; color:black;">
                    <strong>${displayName}</strong><br>
                    <strong>${osmID}</strong><br>
                    <span style="color:gray; font-size:11px;">Tipy: ${tipe}</span>
                </div>
            `);

            // Munculin InfoWindow tepat di titik yang diklik
            infoWindowRef.current?.setPosition(event.latLng);
            infoWindowRef.current?.open(map);
        });

        // Tempel layer ke Map
        roadsLayer.setMap(map);

        // Daftarkan ke cleanup biar HILANG pas reachToObject false
        cleanups.push(() => {
            roadsLayer.setMap(null);
        });

        // Marker Padang (jika unik untuk animasi ini)
        const markerPadang = new google.maps.Marker({
            position: padang,
            map: map,
            title: 'Padang',
            animation: google.maps.Animation.DROP,
            zIndex: 1
        });
        const infoWindowPadang = new google.maps.InfoWindow({ content: 'Padang City' });
        markerPadang.addListener('click', () => infoWindowPadang.open(map, markerPadang));
        cleanups.push(() => { markerPadang.setMap(null); infoWindowPadang.close(); });

        cleanups.push(animateFlight(map, singapore, padang));
        cleanups.push(animateFlight(map, malaysia, padang));
        cleanups.push(animateFlight(map, jakarta, padang));

        cleanups.push(createTextOverlay(map, singapore, `<b>From Singapore (SIN):</b><br>1. Take a flight from Singapore (SIN) to Padang (PDG), Indonesia.<br>2. Rent a car or take a taxi to Nagari Ulakan village.`));
        cleanups.push(createTextOverlay(map, malaysia, `<b>From Kuala Lumpur, Malaysia (KUL):</b><br>1. Take a flight from Kuala Lumpur (KUL) to Padang (PDG), Indonesia.<br>2. Rent a car or take a taxi to Nagari Ulakan village.`));
        cleanups.push(createTextOverlay(map, jakarta, `<b>From Jakarta:</b><br>1. Take a domestic flight to Padang City (PDG), Indonesia.<br>2. Rent a car or take a taxi to Nagari Ulakan village.`));
        cleanups.push(createTextOverlay(map, bandaAceh, `<b>From anywhere in Sumatra:</b><br>1. Option 1: Travel by land directly to Nagari Ulakan village.<br>2. Option 2: Take a flight from your nearest airport in Sumatra to Padang (PDG), Indonesia.<br>3. Rent a car or take a taxi from Padang to Nagari Ulakan village.`));

        const carTimeout = setTimeout(() => {
            const carCleanup = animateCar(map, padang, nagariUlakan);
            cleanups.push(carCleanup);
        }, 6500);
        cleanups.push(() => clearTimeout(carTimeout));

        // Cleanup: panggil semua fungsi cleanup saat efek dibersihkan
        return () => {
            cleanups.forEach(cleanup => cleanup());
        };
    }, [map, reachToObject]);

    return { handleRouteButtonClick };
};

// --- KOMPONEN UTAMA MAPHOMEUPDATE ---
export default function MapHomeUpdateNewVer({
    userLocation, dataMapforType, radius, isManualLocation, setIsManualLocation, setUserLocation,
    objectAround, distances, setDistances, instructions, setInstructions, showLegend,
    dayActivities, selectActivities, traffic, visibility, reachToObject, object,
    goToObject, setGoToObject, showLabels, setShowLabels, showTerrain, setShowTerrain,
    browsePlace, setBrowseId, setBrowseName, activeMapMode, isTravelPlanning, onWaypointAdded, 
    planningWaypoints, planningStart
}: MapExploreUlakanProps) {    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const travelPlanStartRef = useRef<UserLocation | null>(null);                // start rute (beku di A)
    const tpWaypointsRef = useRef<Array<{id:string; name:string; lat:number; lng:number}>>([]); // B, C, ...
    const tpRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);  // renderer rute TP
    const [cursorCoord, setCursorCoord] = useState<{ lat: number; lng: number } | null>(null);
    // const planningStartRef = useRef<UserLocation | null>(null);

    // useEffect(() => {
    //     if (isTravelPlanning) {
    //     if (!planningStartRef.current && userLocation) {            
    //         planningStartRef.current = userLocation; // A = lokasi saat mulai planning
    //     }
    //     } else {
    //     planningStartRef.current = null;
    //     }
    // }, [userLocation]);
    
    // useEffect(() => {
    //     if (isTravelPlanning && userLocation && !travelPlanStartRef.current) {
    //         travelPlanStartRef.current = { ...userLocation }; // A dibekukan sekali
    //     }
    //     if (!isTravelPlanning) {
    //         travelPlanStartRef.current = null;
    //         tpWaypointsRef.current = [];
    //         tpRendererRef.current?.setMap(null);
    //         tpRendererRef.current = null;
    //     }
    // }, [userLocation]);

    // Inisialisasi Peta dan InfoWindow Global (useEffect #1)
    const { map, infoWindowRef } = useGoogleMap(mapContainerRef);

    // Fetch data list all objects (ini sudah ada di kode aslimu, tapi posisinya di sini sudah pas)
    const { data: dataListAllObject } = useQuery({
        queryKey: ['listAllObject'],
        queryFn: fetchListAllObject,
        refetchOnWindowFocus: false // Tambahkan ini jika tidak ingin refetch saat window fokus
    });

    // Gunakan custom hook untuk layers GeoJSON (useEffect #2)
    useGeoJsonLayers(map, visibility, infoWindowRef, setCursorCoord);

    // Dapatkan handlerRouteButtonClick dari useRouteAndAnimations (sebelum useObjectMarkers)
    const { handleRouteButtonClick } = useRouteAndAnimations(
        map, userLocation, dayActivities, selectActivities, dataListAllObject,
        setDistances, setInstructions, reachToObject, infoWindowRef, activeMapMode
    );

    const drawTravelPlan = useCallback(async () => {
        if (!map || !travelPlanStartRef.current || tpWaypointsRef.current.length === 0) return;

        const ds = new google.maps.DirectionsService();
        const origin = new google.maps.LatLng(
            travelPlanStartRef.current.lat,
            travelPlanStartRef.current.lng
        );

        const last = tpWaypointsRef.current[tpWaypointsRef.current.length - 1];
        const destination = new google.maps.LatLng(last.lat, last.lng);

        const waypoints = tpWaypointsRef.current
            .slice(0, -1)
            .map(w => ({ location: new google.maps.LatLng(w.lat, w.lng), stopover: true }));

        const result = await ds.route({
            origin,
            destination,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
        });

        if (!tpRendererRef.current) {
            tpRendererRef.current = new google.maps.DirectionsRenderer({ map });
        }
        tpRendererRef.current.setDirections(result);

        // optional: update tabel Directions di kanan
        const legs = result.routes[0].legs;
        setDistances([legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0)]);
        setInstructions(legs.flatMap(leg => leg.steps.map(step => step.instructions || '')));
    }, [map, setDistances, setInstructions]);

    // const onAddToRoute = useCallback((w: { id:string; name:string; lat:number; lng:number }) => {
    //     // 1) geser pusat radius ke titik baru (OK sesuai keinginanmu)
    //     setUserLocation({ lat: w.lat, lng: w.lng });

    //     // 2) tambah ke rute planning (B, C, ...)
    //     tpWaypointsRef.current = [...tpWaypointsRef.current, w];

    //     // 3) gambar rute lengkap A->...->w
    //     drawTravelPlan();

    //     // 4) kirim ke parent buat ditampilkan di list (supaya bisa dihapus, dsb.)
    //     onWaypointAdded?.(w);
    // }, [handleRouteButtonClick, setUserLocation, onWaypointAdded]);

    // handler saat +Add (JANGAN panggil handleRouteButtonClick agar rute gabungan tidak ke-reset)
    const onAddToRoute = useCallback((w: { id:string; name:string; lat:number; lng:number }) => {
        console.log('ini di onAddToRoute brow', w);
        
        setUserLocation({ lat: w.lat, lng: w.lng }); // pusat radius pindah ke titik baru
        onWaypointAdded?.(w);                        // lempar ke parent (buat list + logic hapus)
    }, [setUserLocation, onWaypointAdded]);

    // RENDER RUTE GABUNGAN (A -> ... -> last)
    const combinedRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
    useEffect(() => {
        if (!map) return;        

        // bersihkan renderer sebelumnya
        if (combinedRendererRef.current) {
            combinedRendererRef.current.setMap(null);
            combinedRendererRef.current = null;
        }

        // if (!isTravelPlanning || !planningWaypoints || planningWaypoints.length === 0 || !planningStartRef.current) {
        // return;
        // }
        console.log('isTravelPlanning', isTravelPlanning);
        console.log('planningWaypoints', planningWaypoints);
        console.log('planningStart', planningStart);
        
        if (!isTravelPlanning || !planningWaypoints || planningWaypoints.length === 0 || !planningStart) {
            return;
        }
        console.log('ini planningWaypoints', planningWaypoints);
        
        const ds = new google.maps.DirectionsService();
        // const origin = new google.maps.LatLng(planningStartRef.current.lat!, planningStartRef.current.lng!);
        const origin = new google.maps.LatLng(planningStart.lat, planningStart.lng);
        const destination = new google.maps.LatLng(
            planningWaypoints[planningWaypoints.length - 1].lat,
            planningWaypoints[planningWaypoints.length - 1].lng
        );
        const wps = planningWaypoints.slice(0, -1).map(w => ({
            location: new google.maps.LatLng(w.lat, w.lng),
            stopover: true
        }));

        ds.route(
        { origin, destination, waypoints: wps, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: false },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                const dr = new google.maps.DirectionsRenderer({ map, suppressMarkers: false });
                console.log('ROUTE ORIGIN', planningStart);
console.log('UI CENTER', userLocation);

                dr.setDirections(result);
                const legs = result.routes[0].legs;

                    // siapkan array final
                    const newDistances: number[] = [];
                    const newInstructions: string[] = [];

                    // label A, B, C, ...
                    const labelForIndex = (i: number) => String.fromCharCode(65 + i); 

                    legs.forEach((leg, i) => {
                    const legKm = (leg.distance?.value ?? 0) / 1000;

                    // 1) sisipkan HEADER utk leg ini (A→B, B→C, ...)
                    newDistances.push(0); // biar tabelmu tetap 2 kolom; 0 = baris judul
                    newInstructions.push(
                        `<div style="font-weight:600;margin:8px 0 4px 0;">
                        ${labelForIndex(i)} → ${labelForIndex(i+1)} — ${legKm.toFixed(1)} km
                        </div>`
                    );

                    // 2) sisipkan STEP2-nya
                    leg.steps.forEach(step => {
                        newDistances.push(step.distance?.value ?? 0);
                        newInstructions.push(step.instructions || '');
                    });
                    });

                    // kirim ke UI lama (tanpa bikin state baru)
                    setDistances(newDistances);
                    setInstructions(newInstructions);
                combinedRendererRef.current = dr;
                } else {
                console.error('Combined route failed:', status);
                }
            }
        );
    }, [map, isTravelPlanning, planningWaypoints, planningStart]);

    // Gunakan custom hook untuk objek marker (attraction, culinary, dll.) (useEffect #3)
    useObjectMarkers(
        map, object, dataListAllObject, browsePlace, setBrowseId, setBrowseName,
        handleRouteButtonClick, infoWindowRef, activeMapMode, isTravelPlanning, onAddToRoute
    );
    useEffect(() => {
        if (!map) return;

        const mouseMoveListener = map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
            setCursorCoord({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
            }
        });

        // Bersih-bersih event biar gak memory leak
        return () => {
            google.maps.event.removeListener(mouseMoveListener);
        };
    }, [map]);

    // Gunakan custom hook untuk lokasi pengguna dan radius (useEffect #4)
    useUserLocationAndRadius(
        map, userLocation, radius, objectAround, infoWindowRef, handleRouteButtonClick, 
        isTravelPlanning, onAddToRoute       // Meneruskan handler routing
    );

    // Gunakan custom hook untuk interaksi peta (manual location, go to object, labels, terrain, traffic) (useEffect #5)
    useMapInteraction(
        map, isManualLocation, setIsManualLocation, setUserLocation,
        goToObject, setGoToObject, showLabels, setShowLabels, showTerrain, setShowTerrain,
        traffic
    );

    // Efek untuk dataMapforType (data hasil pencarian atau filter spesifik) (useEffect #6)
    useEffect(() => {        
        if (!map || !dataMapforType || !infoWindowRef.current) return;
        const currentDataMapMarkers: Record<string, google.maps.Marker> = {}; // Local ref for this effect's markers

        if (dataMapforType.length > 0) {            
            const bounds = new google.maps.LatLngBounds();

            dataMapforType.forEach((item) => {                
                let iconPath = '';
                if (item.id.startsWith("CP")) iconPath = 'culinary';
                else if (item.id.startsWith("WP")) iconPath = 'worship';
                else if (item.id.startsWith("SP")) iconPath = 'souvenir';
                else if (item.id.startsWith("HO")) iconPath = 'homestay';
                else if (item.type === 'A') iconPath = 'attraction'; // Jika ada tipe Attraction di dataMapforType
                // const marker = createMapMarker(
                //     map,
                //     { lat: item.lat, lng: item.lng },
                //     `/icon/${iconPath}.png`,
                //     item.name || '',
                //     // Gunakan komponen MapContent yang sesuai, mungkin MapContentGeneral jika isinya generik
                //     <MapContentGeneral // Atau MapContentCulinaryPlaces, etc. sesuai item.id
                //         id={item.id} name={item.name} address={item.address} contact_person={item.contact_person}
                //         capacity={item.capacity} lat={item.lat} lng={item.lng} onRouteClick={handleRouteButtonClick}
                //     />,
                //     infoWindowRef
                // );
                // currentDataMapMarkers[item.id] = marker; // Simpan referensi marker ini
                // bounds.extend(marker.getPosition() as google.maps.LatLng);
            });

            // if (!bounds.isEmpty()) {
            //     map.fitBounds(bounds);
            // }
        }

        return () => {
            Object.values(currentDataMapMarkers).forEach(marker => marker.setMap(null));
        };
    }, [dataMapforType, map, handleRouteButtonClick, infoWindowRef]);

    useEffect(() => {
        if (legendRef.current) {
            const legendContent = legendRef.current.querySelector('.legend-content') as HTMLElement;
            if (legendContent) legendContent.style.display = showLegend ? 'block' : 'none';
        }
    }, [showLegend]);

//   return (
//     <div className="relative">
//       <div ref={legendRef} className={`absolute bottom-6 left-2 `} style={{ zIndex: 100 }}>
//         {showLegend && (
//           <div className="legend-content" style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
//             <Legend />
//           </div>
//         )}
        
//       </div>
//       <div ref={mapContainerRef} className="text-slate-700 h-[500px] md:h-[550px] rounded-lg"></div>
//     </div>
//   );
    return (
        <div className="relative"> {/* <- Ini Container Utama (Parent) */}
        
        {/* 1. LEGEND (Kode Lama) */}
        <div ref={legendRef} className={`absolute bottom-6 left-2 `} style={{ zIndex: 100 }}>
            {showLegend && (
            <div className="legend-content" style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
                <Legend />
            </div>
            )}
        </div>

        {/* 2. MATA ANGIN (Baru Diselipin Disini) */}
        <div 
            className="absolute top-16 right-2 z-10 p-1 bg-white/80 rounded-full shadow-md"
            // Penjelasan:
            // top-20 : Biar gak ketabrak tombol "Map/Satellite" bawaan Google di pojok kanan atas
            // right-4: Nempel kanan
            // z-10   : Wajib di atas map
        >
            <img 
                src="/icon/north-arrow.png" // Pastikan filenya ada di public/icon/
                alt="North Arrow" 
                className="w-10 h-10"       // Sesuaikan ukuran (misal 40px)
                style={{ display: 'block' }}
            />
        </div>

        {cursorCoord && (
            <div className="absolute bottom-7 left-2 z-10 bg-white/90 px-2 py-1 rounded shadow text-xs font-mono text-slate-700 pointer-events-none">
                {/* pointer-events-none: Biar kalau kursor lewat di atas angka ini, map di belakangnya gak ke-block */}
                <div>Lat: {cursorCoord.lat.toFixed(5)}</div>
                <div>Lng: {cursorCoord.lng.toFixed(5)}</div>
            </div>
            )}
        <div className="absolute bottom-6 right-14 z-10">
            <CustomScale map={map} />
        </div>

        {/* 3. MAP CONTAINER (Kode Lama) */}
        <div ref={mapContainerRef} className="text-slate-700 h-[500px] md:h-[550px] rounded-lg"></div>
        
        </div>
    );
}