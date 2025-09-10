// MapLandingPage.tsx

'use client'

import InfoWindowContent from "@/app/(landingPage)/_components/infoWindow";
import { fetchAllAttraction } from "@/app/(pages)/api/fetchers/attraction";
import { Loader } from "@googlemaps/js-api-loader";
import { useQuery } from "@tanstack/react-query";
// 1. IMPORT 'memo' DARI REACT
import React, { useEffect, useState, memo, useRef } from "react"
import { createRoot } from "react-dom/client";

// let map: google.maps.Map | null = null;
const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly'
})
const position = {
    lat: -0.7102134517843606,
    lng: 100.19420485758688
}

interface MapLandingPageProps {
    selectedCategory: string | null;
}
interface Attraction {
    id: string;
    name: string;
    type: string;
    price: number;
    lat: number;
    lng: number;
}

// Pisahkan komponen agar bisa dibungkus dengan memo
function MapComponent({ selectedCategory }: MapLandingPageProps) {
    console.log("Map component is rendering for category:", selectedCategory); // Ini hanya akan jalan saat perlu
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const mapRef = React.useRef<HTMLDivElement>(null)
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    const { data: listAttraction, isLoading: loadingListAttraction } = useQuery<Attraction[]>({
        queryKey: ['listAllAttractions'],
        queryFn: ()=>fetchAllAttraction()
    })    

    // useEffect untuk inisialisasi peta. HANYA JALAN SEKALI.
    useEffect(() => {
        const initMap = async () => {
          const { Map } = await loader.importLibrary('maps')
          window.google = google;
          const mapOptions: google.maps.MapOptions = {
              center: position,
              zoom: 16,
              mapTypeId: 'satellite',
              styles: [
                  {
                      "featureType": "all",
                      "elementType": "labels",
                      "stylers": [
                          { "visibility": "off" }
                      ]
                  }
              ],
              disableDefaultUI: true,
          }
          // Buat instance peta baru
            const newMap = new Map(mapRef.current as HTMLDivElement, mapOptions);
            
            // Set state dengan instance peta yang baru dibuat
            setMapInstance(newMap); 
          // Inisialisasi InfoWindow sekali saja
          if (!infoWindowRef.current) {
              infoWindowRef.current = new google.maps.InfoWindow();
          }
        }
        
        // Pastikan peta tidak diinisialisasi ulang jika sudah ada
        if (!mapInstance) {
            initMap();
        }
    }, []) // 2. UBAH DEPENDENCY JADI KOSONG '[]' AGAR HANYA JALAN SEKALI SAAT COMPONENT MOUNT

    // useEffect untuk mengupdate marker saat kategori atau data berubah
    useEffect(() => {
        // Jangan lakukan apa-apa jika peta atau data belum siap
        if (!mapInstance || !listAttraction) return;

        // Bersihkan marker lama dari peta
        markers.forEach(marker => marker.setMap(null));

        const iconMapping: { [key: string]: string } = {
        'Culinary': '/icon/culinary.png',
        'Religion': '/icon/worship.png'
        // Tipe lain akan menggunakan ikon default
        };
        const defaultIcon = '/icon/package.png';
        
        // **PERUBAHAN UTAMA DI SINI**
        // Filter data berdasarkan 'type' dan 'selectedCategory'
        const filteredData = listAttraction.filter((attraction) =>
            attraction.type === selectedCategory
        );
        
        // Buat marker baru dari data yang sudah difilter
        const newMarkers = filteredData.map((attraction) => {
          const iconUrl = iconMapping[attraction.type] || defaultIcon;
          const marker = new google.maps.Marker({
                position: { lat: attraction.lat, lng: attraction.lng },
                map: mapInstance,
                animation: google.maps.Animation.DROP,
                title: attraction.name,
                icon: {
                    url: iconUrl,
                }
            });
            marker.addListener('click', () => {
                // A. Animasi bounce
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 1500); // Durasi bounce

                // B. Render komponen React ke dalam InfoWindow
                const container = document.createElement('div');
                const root = createRoot(container);
                root.render(
                    <InfoWindowContent 
                        id={attraction.id}
                        name={attraction.name}
                        type={attraction.type}
                    />
                );

                // C. Buka InfoWindow
                const infoWindow = infoWindowRef.current;
                if (infoWindow) {
                    infoWindow.setContent(container);
                    infoWindow.open(mapInstance, marker);
                }
            });

            return marker;
          // return new google.maps.Marker({
          //     // Gunakan properti 'lat' dan 'lng' dari data
          //     position: { lat: attraction.lat, lng: attraction.lng },
          //     map: map,
          //     title: `${attraction.name}\n Harga: Rp ${attraction.price.toLocaleString('id-ID')}`, // Judul saat hover
          //     animation: google.maps.Animation.DROP, // Animasi saat marker muncul
          //     icon: {
          //       url: iconUrl
          //   }
          // });
        });

        // Simpan marker baru ke state untuk bisa dibersihkan nanti
        setMarkers(newMarkers);

        // Geser peta ke lokasi marker pertama jika ada hasil
        if (newMarkers.length > 0) {
            mapInstance.panTo(newMarkers[0].getPosition()!);
            mapInstance.setZoom(15);
        }

    }, [mapInstance, selectedCategory, listAttraction]); // Jalankan efek ini jika kategori atau list data berubah// Jalan jika 'selectedCategory' atau 'dataListAllAttraction' berubah

    return (
        <div className="relative">
            <div ref={mapRef} className="text-slate-700 w-full md:h-[700px] rounded-lg"></div>
        </div>
    )
}

// 3. BUNGKUS KOMPONEN DENGAN React.memo SEBELUM DI-EXPORT
export default memo(MapComponent);