'use client'

import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect } from "react";

let map: google.maps.Map | null = null;
let drawingManager: google.maps.drawing.DrawingManager | null = null;

export default function MapInput() {
  const mapRef = React.useRef<HTMLDivElement>(null)

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: 'weekly'
  })
  const position = {
    lat: -0.7102134517843606,
    lng: 100.19420485758688
  }

  const initMap = async () => {
    const { Map } = await loader.importLibrary('maps')
    const { DrawingManager } = await loader.importLibrary('drawing')

    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 19,
    }
    map = new Map(mapRef.current as HTMLDivElement, mapOptions)
    // let selectedShape = new google.maps.drawing.DrawingManager()
    drawingManager = new google.maps.drawing.DrawingManager()

    const drawingManagerOpts = {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ]
      },
      polygonOptions: {
        fillColor: 'blue',
        strokeColor: 'blue',
        editable: true,
      },
      map: map
    };
    drawingManager.setOptions(drawingManagerOpts);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event: any) {
      if (drawingManager !== null) {
        drawingManager.setOptions({
          drawingControl: false,
          drawingMode: null,
        });
      }
      const newShape = event.overlay;
      newShape.type = event.type;
      setSelection(newShape);
    });

    drawingManager.setMap(map);
  }

  const setSelection = (shape: any) => {
    shape.setEditable(true);
  }

  useEffect(() => {
    initMap()
  }, [])

  return (
    <div ref={mapRef} className="text-slate-700 h-[65vh] rounded-lg m-4"></div>
  )
}