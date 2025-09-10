'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// Tidak ada lagi variabel global di sini!

interface MapInputProps {
  onCoordinateChange: (latitude: number | null, longitude: number | null) => void;
  onGeometryChange: (geometry: any | null) => void;
}

const MapInput = forwardRef(({ onCoordinateChange, onGeometryChange }: MapInputProps, ref) => {
  // Gunakan useRef untuk menyimpan referensi ke DOM element dan instance Google Maps
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  // State untuk mengontrol posisi peta dari luar (via fungsi search)
  const [searchPosition, setSearchPosition] = useState<{ lat: number, lng: number } | null>(null);

  // Fungsi untuk membersihkan polygon dan marker
  const deletePolygon = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        drawingControl: true,
        drawingMode: google.maps.drawing.OverlayType.POLYGON
      });
    }
    onCoordinateChange(null, null);
    onGeometryChange(null);
  };

  // Expose fungsi ke komponen parent melalui ref
  useImperativeHandle(ref, () => ({
    deletePolygon,
    search: (longitude: number, latitude: number) => {
      setSearchPosition({ lat: latitude, lng: longitude });
    }
  }));

  // useEffect utama untuk inisialisasi peta, hanya berjalan sekali
  useEffect(() => {
    // Flag untuk memastikan cleanup berjalan dengan benar
    let isMounted = true; 

    const initMap = async () => {
      // Pastikan div untuk peta sudah ada
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly',
        libraries: ["drawing", "marker"] // Muat semua library yang dibutuhkan di awal
      });

      try {
        // Tunggu semua library selesai di-load
        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
        const { DrawingManager } = await loader.importLibrary('drawing') as google.maps.DrawingLibrary;
        const { Marker } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

        // Cek lagi setelah await, mungkin komponen sudah unmount
        if (!isMounted) return;

        const mapOptions: google.maps.MapOptions = {
          center: { lat: -0.7102, lng: 100.1942 },
          zoom: 19,
          mapId: 'YOUR_MAP_ID', // Rekomendasi: Gunakan Map ID
          mapTypeId: 'satellite'
        };

        // Buat instance peta dan simpan di ref
        const map = new Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        const drawingManager = new DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
          },
          polygonOptions: {
            fillColor: 'blue',
            strokeColor: 'blue',
            editable: true
          }
        });
        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        // Listener untuk saat polygon selesai digambar
        drawingManager.addListener('overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
          // Hapus polygon lama jika ada
          deletePolygon();
          
          const newShape = event.overlay as google.maps.Polygon;
          polygonRef.current = newShape;

          // Matikan mode gambar
          drawingManager.setOptions({
            drawingControl: false,
            drawingMode: null,
          });

          // Fungsi untuk memproses polygon baru
          const processShape = () => {
            const paths = newShape.getPath().getArray();
            if (paths.length === 0) return;

            let centroidLat = 0;
            let centroidLng = 0;
            paths.forEach(pos => {
              centroidLat += pos.lat();
              centroidLng += pos.lng();
            });
            centroidLat /= paths.length;
            centroidLng /= paths.length;
            
            // Update state & panggil callback parent
            onCoordinateChange(centroidLat, centroidLng);

            // Buat marker baru di tengah polygon
            const marker = new Marker({
              position: { lat: centroidLat, lng: centroidLng },
              map: map,
              animation: google.maps.Animation.DROP
            });
            markerRef.current = marker;

            // Konversi ke GeoJSON untuk parent
            const dataLayer = new google.maps.Data();
            dataLayer.add(new google.maps.Data.Feature({
              geometry: new google.maps.Data.Polygon([newShape.getPath().getArray()])
            }));
            dataLayer.toGeoJson((object: any) => {
              onGeometryChange(object.features[0]?.geometry || null);
            });
          };

          processShape();

          // Tambahkan listener jika polygon diubah oleh user
          newShape.getPath().addListener('set_at', processShape);
          newShape.getPath().addListener('insert_at', processShape);
        });

      } catch (error) {
        console.error("Gagal memuat Google Maps:", error);
      }
    };

    initMap();

    // Fungsi cleanup: berjalan saat komponen di-unmount untuk mencegah memory leak
    return () => {
      isMounted = false;
      // Di sini bisa ditambahkan logika untuk menghancurkan peta jika perlu
    };
  }, [onCoordinateChange, onGeometryChange]); // Tambahkan dependensi yang stabil

  // useEffect untuk menangani perubahan posisi dari luar
  useEffect(() => {
    if (searchPosition && mapInstanceRef.current) {
      const newPosition = new google.maps.LatLng(searchPosition.lat, searchPosition.lng);
      mapInstanceRef.current.panTo(newPosition);
      mapInstanceRef.current.setZoom(19);
    }
  }, [searchPosition]);

  return (
    <div ref={mapRef} className="text-slate-700 h-[60vh] rounded-lg m-4"></div>
  );
});

MapInput.displayName = 'MapInput'; // Tambahan untuk debugging
export default MapInput;