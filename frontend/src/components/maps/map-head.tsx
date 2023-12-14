import { useState } from 'react';

export default function MapHead() {
  const [userLat, setUserLat] = useState(0);
  const [userLng, setUserLng] = useState(0);

  const clearRadius = () => {
    // Implement logic for clearing radius
  };

  const clearRoute = () => {
    // Implement logic for clearing route
  };

  const clearUser = () => {
    // Implement logic for clearing user
  };

  const currentPosition = () => {
    // Implement logic for current position
  };

  const viewLegend = () => {
    // Implement logic for viewing legend
  };

  // const setUserLoc = (lat, lng) => {
  //   // Implement logic for setting user location
  //   setUserLat(lat);
  //   setUserLng(lng);
  // };

  const manualPosition = () => {
    clearRadius();
    clearRoute();

    if (userLat === 0 && userLng === 0) {
      // Use a modal library for alerting, e.g., react-toastify, react-modal, etc.
      alert('Click on Map');
    }

    // map.addListener('click', (mapsMouseEvent) => {
    //   // Implement the logic from your existing manualPosition function
    //   // Note: You need to replace the references to map, infoWindow, etc. with the appropriate Next.js equivalents.
    //   // Also, consider using useEffect to handle side effects like event listeners.
    // });
  };

  return (
    <div className="col">
      <button
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Current Location"
        className="btn icon btn-primary mx-1"
        id="current-position"
        onClick={currentPosition}
      >
        <span className="material-symbols-outlined">my_location</span>
      </button>
      <button
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Set Manual Location"
        className="btn icon btn-primary mx-1"
        id="manual-position"
        onClick={manualPosition}
      >
        <span className="material-symbols-outlined">pin_drop</span>
      </button>
      <button
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Toggle Legend"
        className="btn icon btn-primary mx-1"
        id="legend-map"
        onClick={viewLegend}
      >
        <span className="material-symbols-outlined">visibility</span>
      </button>
    </div>
  );
}
