'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

let map: google.maps.Map | null = null;
let drawingManager: google.maps.drawing.DrawingManager | null = null;
let marker: google.maps.Marker | null = null;

interface MapEditProps {
  onCoordinateChange: (latitude: number | null, longitude: number | null) => void;
  onGeometryChange: (geometry: any) => void;
  geom: any;
}

const MapEdit = forwardRef(({ onCoordinateChange, onGeometryChange, geom }: MapEditProps, ref) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<google.maps.Marker | null>(null);
  const newShapeRef = useRef<google.maps.Polygon | null>(null);

  const setupGeom = async () => {
    if (geom) {
      const geomJson = JSON.parse(geom);

      if (geomJson.type === 'MultiPolygon') {
        const { Polygon } = await loader.importLibrary("maps")

        // Jika tipe geometri adalah MultiPolygon
        const polygons = geomJson.coordinates.map((polygonCoords: any) => {
          // Membuat array koordinat untuk setiap polygon
          const coordinates = polygonCoords[0].map((coord: any) => ({
            lat: coord[1],
            lng: coord[0]
          }));

          // Membuat poligon baru dari koordinat
          const newPolygon = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: true // Jika ingin poligon dapat diedit
          });

          // Menambahkan poligon ke peta
          newPolygon.setMap(map);
          return newPolygon;
        });

        // Mengatur ref newShapeRef dengan array poligon yang baru dibuat
        newShapeRef.current = polygons;
      } else {
        // Handling for other types of geometry if needed
      }
    }
  };

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly'
  })
  const position = {
    lat: -0.7102134517843606,
    lng: 100.19420485758688
  }

  const deletePolygon = () => {
    if (newShapeRef.current?.setMap) {
      newShapeRef.current.setMap(null);
      newShapeRef.current = null;
      markerRef.current?.setMap(null)
      markerRef.current = null
      setLatitude(null)
      setLongitude(null)
      onCoordinateChange(null, null);
      if (drawingManager) {
        drawingManager.setOptions({
          drawingControl: true,
          drawingMode: google.maps.drawing.OverlayType.POLYGON
        });
      }
      onGeometryChange(null)
    }
  };

  const search = (longitude: number, latitude: number) => {
    setLongitude(longitude)
    setLatitude(latitude)
  }

  useImperativeHandle(ref, () => ({
    deletePolygon: () => deletePolygon(),
    search: (longitude: number, latitude: number) => search(longitude, latitude)
  }));

  const saveSelection = (shape: any) => {
    if (map != null) {
      newShapeRef.current = shape;

      let str_input = 'MULTIPOLYGON(((';
      let coord = [];
      let centroid = [0.0, 0.0];
      const paths = shape.getPath().getArray();

      for (let i = 0; i < paths.length; i++) {
        centroid[0] += paths[i].lat();
        centroid[1] += paths[i].lng();
        coord[i] = paths[i].lng() + ' ' + paths[i].lat();
        str_input += paths[i].lng() + ' ' + paths[i].lat() + ',';
      }

      str_input = str_input + '' + coord[0] + ')))';
      const totalPaths = paths.length;
      centroid[0] = centroid[0] / totalPaths;
      centroid[1] = centroid[1] / totalPaths;
      onCoordinateChange(parseFloat(centroid[0].toFixed(8)), parseFloat(centroid[1].toFixed(8)));

      let pos = new google.maps.LatLng(centroid[0], centroid[1]);
      map.panTo(pos);

      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        map: map,
      });
      markerRef.current = marker;

      const latitudeInput = document.getElementById('latitude') as HTMLInputElement;
      const longitudeInput = document.getElementById('longitude') as HTMLInputElement;
      const multipolygonInput = document.getElementById('multipolygon') as HTMLInputElement;

      if (latitudeInput && longitudeInput && multipolygonInput) {
        latitudeInput.value = centroid[0].toFixed(8);
        longitudeInput.value = centroid[1].toFixed(8);
        multipolygonInput.value = str_input;
      }

      const dataLayer = new google.maps.Data();
      dataLayer.add(new google.maps.Data.Feature({
        geometry: new google.maps.Data.Polygon([shape.getPath().getArray()])
      }));
      dataLayer.toGeoJson(function (object: any) {
        const geometry = object?.features[0]?.geometry;
        if (geometry) {
          onGeometryChange(geometry)
        }
      });
    }
  }

  const initMap = async () => {
    const { Map } = await loader.importLibrary('maps')
    const { DrawingManager } = await loader.importLibrary('drawing')

    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 19,
    }

    map = new Map(mapRef.current as HTMLDivElement, mapOptions)
    drawingManager = new google.maps.drawing.DrawingManager()
    drawingManager = new google.maps.drawing.DrawingManager({
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


    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event: any) {
      if (drawingManager !== null) {
        drawingManager.setOptions({
          drawingControl: false,
          drawingMode: null,
        });
      }
      const newShape = event.overlay;
      newShape.type = event.type;
      saveSelection(newShape);
    });
    drawingManager.setMap(map);

    if (newShapeRef.current) {
      if (Array.isArray(newShapeRef.current)) {
        newShapeRef.current.forEach(polygon => {
          polygon.setMap(map);
        });
      }
    }
  }

  useEffect(() => {
    setupGeom()
    initMap()
  }, [])

  useEffect(() => {
    if (longitude !== null && latitude !== null && map) {
      let newPosition = new google.maps.LatLng(latitude, longitude);
      map.panTo(newPosition);
      map.setZoom(19);
    }
  }, [longitude, latitude])

  return (
    <div ref={mapRef} className="text-slate-700 h-[60vh] rounded-lg m-4"></div>
  )
})

export default MapEdit;