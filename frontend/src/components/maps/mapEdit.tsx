// 'use client'

// import { Loader } from "@googlemaps/js-api-loader"
// import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// let map: google.maps.Map | null = null;
// let drawingManager: google.maps.drawing.DrawingManager | null = null;
// let marker: google.maps.Marker | null = null;

// interface MapEditProps {
//   onCoordinateChange: (latitude: number | null, longitude: number | null) => void;
//   onGeometryChange: (geometry: any) => void;
//   geom: any;
// }

// const MapEdit = forwardRef(({ onCoordinateChange, onGeometryChange, geom }: MapEditProps, ref) => {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const mapRef = useRef<HTMLDivElement>(null)
//   const markerRef = useRef<google.maps.Marker | null>(null);
//   const newShapeRef = useRef<google.maps.Polygon | null>(null);

//   const setupGeom = async () => {
//     if (geom) {      
//       const geomJson = geom;

//       if (geomJson.type === 'MultiPolygon') {
//         const { Polygon } = await loader.importLibrary("maps")

//         // Jika tipe geometri adalah MultiPolygon
//         const polygons = geomJson.coordinates.map((polygonCoords: any) => {
//           // Membuat array koordinat untuk setiap polygon
//           const coordinates = polygonCoords[0].map((coord: any) => ({
//             lat: coord[1],
//             lng: coord[0]
//           }));
//           console.log(coordinates);
          

//           // Membuat poligon baru dari koordinat
//           const newPolygon = new google.maps.Polygon({
//             paths: coordinates,
//             strokeColor: '#FF0000',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#FF0000',
//             fillOpacity: 0.35,
//             editable: true // Jika ingin poligon dapat diedit
//           });

//           // Menambahkan poligon ke peta
//           newPolygon.setMap(map);
//           return newPolygon;
//         });

//         // Mengatur ref newShapeRef dengan array poligon yang baru dibuat
//         newShapeRef.current = polygons;
//       } else {
//         // Handling for other types of geometry if needed
//       }
//     }
//   };

//   const loader = new Loader({
//     apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
//     version: 'weekly'
//   })
//   const position = {
//     lat: -0.7102134517843606,
//     lng: 100.19420485758688
//   }

//   const deletePolygon = () => {
//     if (newShapeRef.current?.setMap) {
//       newShapeRef.current.setMap(null);
//       newShapeRef.current = null;
//       markerRef.current?.setMap(null)
//       markerRef.current = null
//       setLatitude(null)
//       setLongitude(null)
//       onCoordinateChange(null, null);
//       if (drawingManager) {
//         drawingManager.setOptions({
//           drawingControl: true,
//           drawingMode: google.maps.drawing.OverlayType.POLYGON
//         });
//       }
//       onGeometryChange(null)
//     }
//   };

//   const search = (longitude: number, latitude: number) => {
//     setLongitude(longitude)
//     setLatitude(latitude)
//   }

//   useImperativeHandle(ref, () => ({
//     deletePolygon: () => deletePolygon(),
//     search: (longitude: number, latitude: number) => search(longitude, latitude)
//   }));

//   const saveSelection = (shape: any) => {
//     if (map != null) {
//       newShapeRef.current = shape;

//       let str_input = 'MULTIPOLYGON(((';
//       let coord = [];
//       let centroid = [0.0, 0.0];
//       const paths = shape.getPath().getArray();

//       for (let i = 0; i < paths.length; i++) {
//         centroid[0] += paths[i].lat();
//         centroid[1] += paths[i].lng();
//         coord[i] = paths[i].lng() + ' ' + paths[i].lat();
//         str_input += paths[i].lng() + ' ' + paths[i].lat() + ',';
//       }

//       str_input = str_input + '' + coord[0] + ')))';
//       const totalPaths = paths.length;
//       centroid[0] = centroid[0] / totalPaths;
//       centroid[1] = centroid[1] / totalPaths;
//       onCoordinateChange(parseFloat(centroid[0].toFixed(8)), parseFloat(centroid[1].toFixed(8)));

//       let pos = new google.maps.LatLng(centroid[0], centroid[1]);
//       map.panTo(pos);

//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//         markerRef.current = null;
//       }

//       marker = new google.maps.Marker({
//         position: pos,
//         animation: google.maps.Animation.DROP,
//         map: map,
//       });
//       markerRef.current = marker;

//       const latitudeInput = document.getElementById('latitude') as HTMLInputElement;
//       const longitudeInput = document.getElementById('longitude') as HTMLInputElement;
//       const multipolygonInput = document.getElementById('multipolygon') as HTMLInputElement;

//       if (latitudeInput && longitudeInput && multipolygonInput) {
//         latitudeInput.value = centroid[0].toFixed(8);
//         longitudeInput.value = centroid[1].toFixed(8);
//         multipolygonInput.value = str_input;
//       }

//       const dataLayer = new google.maps.Data();
//       dataLayer.add(new google.maps.Data.Feature({
//         geometry: new google.maps.Data.Polygon([shape.getPath().getArray()])
//       }));
//       dataLayer.toGeoJson(function (object: any) {
//         const geometry = object?.features[0]?.geometry;
//         if (geometry) {
//           onGeometryChange(geometry)
//         }
//       });
//     }
//   }

//   const initMap = async () => {
//     const { Map } = await loader.importLibrary('maps')
//     const { DrawingManager } = await loader.importLibrary('drawing')

//     const mapOptions: google.maps.MapOptions = {
//       center: position,
//       zoom: 19,
//     }

//     map = new Map(mapRef.current as HTMLDivElement, mapOptions)
//     drawingManager = new google.maps.drawing.DrawingManager()
//     drawingManager = new google.maps.drawing.DrawingManager({
//       drawingMode: google.maps.drawing.OverlayType.POLYGON,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: [google.maps.drawing.OverlayType.POLYGON]
//       },
//       polygonOptions: {
//         fillColor: 'blue',
//         strokeColor: 'blue',
//         editable: true
//       }
//     });


//     google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event: any) {
//       if (drawingManager !== null) {
//         drawingManager.setOptions({
//           drawingControl: false,
//           drawingMode: null,
//         });
//       }
//       const newShape = event.overlay;
//       newShape.type = event.type;
//       saveSelection(newShape);
//     });
//     drawingManager.setMap(map);

//     if (newShapeRef.current) {
//       if (Array.isArray(newShapeRef.current)) {
//         newShapeRef.current.forEach(polygon => {
//           polygon.setMap(map);
//         });
//       }
//     }
//   }

//   useEffect(() => {
//     setupGeom()
//     initMap()
//   }, [])

//   useEffect(() => {
//     if (longitude !== null && latitude !== null && map) {
//       let newPosition = new google.maps.LatLng(latitude, longitude);
      
//       map.panTo(newPosition);
//       map.setZoom(17);
//     }
//   }, [longitude, latitude])

//   return (
//     <div ref={mapRef} className="text-slate-700 h-[60vh] rounded-lg m-4"></div>
//   )
// })

// MapEdit.displayName = 'MapEdit';

// export default MapEdit;

'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// Tidak ada lagi variabel global di sini!

interface MapEditProps {
  onCoordinateChange: (latitude: number | null, longitude: number | null) => void;
  onGeometryChange: (geometry: any | null) => void;
  geom: any;
}

const MapEdit = forwardRef(({ onCoordinateChange, onGeometryChange, geom }: MapEditProps, ref) => {
  // ✅ GUNAKAN useRef untuk semua instance, bukan variabel global
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null); // Untuk poligon yang digambar/diedit
  const markerRef = useRef<google.maps.Marker | null>(null);
  const initialPolygonRef = useRef<google.maps.Polygon[]>([]); // Untuk poligon awal dari `geom`

  // State untuk kontrol peta dari luar
  const [searchPosition, setSearchPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // ✅ PERBAIKAN 1: Deklarasikan SEMUA library yang dibutuhkan di awal.
  // Taruh di luar komponen atau gunakan useMemo agar tidak dibuat ulang.
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly',
    libraries: ["maps", "drawing", "marker"] // Sebutkan semua di sini
  });

  // Fungsi untuk membersihkan semua overlay
  const clearOverlays = () => {
    // Hapus poligon yang digambar user
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    // Hapus poligon awal dari `geom`
    initialPolygonRef.current.forEach(p => p.setMap(null));
    initialPolygonRef.current = [];
    
    // Hapus marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  // Fungsi untuk mengaktifkan kembali mode gambar
  const enableDrawing = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        drawingControl: true,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    deletePolygon: () => {
      clearOverlays();
      enableDrawing();
      onCoordinateChange(null, null);
      onGeometryChange(null);
    },
    search: (longitude: number, latitude: number) => {
      setSearchPosition({ lng: longitude, lat: latitude });
    }
  }));

  // ✅ PERBAIKAN 3: Strukturkan ulang useEffect untuk inisialisasi yang bersih
  useEffect(() => {
    if (isMapInitialized || !mapRef.current) return;

    const initMap = async () => {
      try {
        const { Map } = await loader.importLibrary('maps');
        const { DrawingManager } = await loader.importLibrary('drawing');
        const { Marker } = await loader.importLibrary('marker');

        const mapOptions: google.maps.MapOptions = {
          center: { lat: -0.7102, lng: 100.1942 },
          zoom: 19,
          mapId: 'YOUR_MAP_ID',
          mapTypeId: 'satellite'
        };
        
        const map = new Map(mapRef.current!, mapOptions);
        mapInstanceRef.current = map;

        const drawingManager = new DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
          },
          polygonOptions: {
            fillColor: 'blue',
            strokeColor: 'blue',
            editable: true,
            draggable: true,
          }
        });
        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        // Fungsi untuk memproses bentuk (poligon)
        const processShape = (shape: google.maps.Polygon) => {
            const path = shape.getPath();
            if (path.getLength() === 0) return;

            const bounds = new google.maps.LatLngBounds();
            path.getArray().forEach(pos => bounds.extend(pos));
            const center = bounds.getCenter();

            onCoordinateChange(center.lat(), center.lng());

            if (markerRef.current) markerRef.current.setMap(null);
            markerRef.current = new Marker({
                position: center,
                map: map,
                animation: google.maps.Animation.DROP
            });
            
            // Konversi ke GeoJSON
            const dataLayer = new google.maps.Data();

          const pathArray = shape.getPath().getArray(); 

          // Buat instance google.maps.Data.Polygon dari Array standar
          const dataPolygon = new google.maps.Data.Polygon([pathArray]);

          // Masukkan Data.Polygon yang sudah benar formatnya
          dataLayer.add(new google.maps.Data.Feature({ geometry: dataPolygon }));

          // ✅ FIX 2: Beri tahu TypeScript bahwa 'obj' boleh memiliki properti apa pun (tipe 'any')
          dataLayer.toGeoJson((obj: any) => {
              onGeometryChange(obj.features[0]?.geometry || null);
          });
        };

        // Listener saat menggambar selesai
        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
            clearOverlays(); // Hapus semua yang lama
            
            const newShape = event.overlay as google.maps.Polygon;
            polygonRef.current = newShape;

            drawingManager.setOptions({ drawingControl: false, drawingMode: null });
            
            processShape(newShape);

            // Tambahkan listener untuk editan
            newShape.getPath().addListener('set_at', () => processShape(newShape));
            newShape.getPath().addListener('insert_at', () => processShape(newShape));
            newShape.getPath().addListener('remove_at', () => processShape(newShape));
        });

        // Tampilkan geometri awal jika ada
        if (geom && geom.type === 'MultiPolygon') {
          drawingManager.setOptions({ drawingControl: false, drawingMode: null });
          geom.coordinates.forEach((polygonCoords: number[][][]) => {
              const path = polygonCoords[0].map(coord => ({ lat: coord[1], lng: coord[0] }));
              const polygon = new google.maps.Polygon({
                  paths: path,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  editable: true,
                  draggable: true,
                  map: map,
              });
              
              processShape(polygon); // Proses poligon ini untuk dapatkan centroid dll.
              polygonRef.current = polygon; // Anggap ini poligon aktif
              
              // Tambahkan listener untuk editan
              polygon.getPath().addListener('set_at', () => processShape(polygon));
              polygon.getPath().addListener('insert_at', () => processShape(polygon));
              polygon.getPath().addListener('remove_at', () => processShape(polygon));

              // Zoom ke poligon
              const bounds = new google.maps.LatLngBounds();
              path.forEach(pos => bounds.extend(pos));
              map.fitBounds(bounds);
          });
        }
        
        setIsMapInitialized(true);

      } catch (e) {
        console.error("Error initializing map:", e);
      }
    };

    initMap();

  }, [geom, onCoordinateChange, onGeometryChange]); // Hapus isMapInitialized agar tidak re-trigger loop tak terbatas

  // useEffect untuk handle pencarian
  useEffect(() => {
    if (searchPosition && mapInstanceRef.current) {
        mapInstanceRef.current.panTo(searchPosition);
        mapInstanceRef.current.setZoom(19);
    }
  }, [searchPosition]);

  return <div ref={mapRef} className="text-slate-700 h-[60vh] rounded-lg m-4"></div>;
});

MapEdit.displayName = 'MapEdit';
export default MapEdit;