'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onCloseClick: () => void;
  onRadiusChange: (value: number) => void;
  onStateChange: (newState: any) => void;
  waypoints: { id:string; name:string; lat:number; lng:number }[];   // NEW
  onRemove: (index:number) => void;                                   // NEW
  onClear: () => void;
  startLabel: 'GTP Gate' | 'My Location';
}

type Pickable =
  | 'unique'
  | 'attraction'
  | 'homestay'
  | 'culinary'
  | 'worship'
  | 'souvenir'

export default function TravelPlanning({
  onCloseClick,
  onRadiusChange,
  onStateChange,
  waypoints,
  onClear,
  onRemove,
  startLabel
}: Props) {
  // --- Route list (top card) ---
  const [hasMyLocation, setHasMyLocation] = useState(true);

  // --- Filters (bottom card) ---
  const [checked, setChecked] = useState<Record<Pickable, boolean>>({
    attraction: false,
    homestay: false,
    culinary: false,
    worship: false,
    souvenir: false,
    unique: false,
  });
  const [radius, setRadius] = useState(0);
  // console.log(waypoints);
  
  // tombol Search aktif hanya jika ada kategori dicentang dan radius > 0
  const canSearch = useMemo(
    () => radius > 0 && Object.values(checked).some(Boolean),
    [radius, checked]
  );

  const handleToggle = (key: Pickable) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRadius = (v: number) => {
    setRadius(v);
    onRadiusChange(v); // langsung sinkron ke peta saat slider digeser
  };

  const handleSearch = () => {
    // mapping ke shape MapType milik peta kamu
    const mapTypePayload = {
      attraction: checked.attraction,
      homestay: checked.homestay,
      culinaryPlaces: checked.culinary,
      worshipPlaces: checked.worship,
      souvenirPlaces: checked.souvenir,
      // serviceProvider dikirim juga (kalau nanti kamu pakai)
      uniqueAttraction: checked.unique,
    };
    onStateChange(mapTypePayload);
  };

  const restoreMyLocation = () => setHasMyLocation(true);

  return (
    <div className="flex flex-col lg:w-1/3 gap-4">

      {/* Card 1: Your Travel Route */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Travel Route</h2>

        <div className="space-y-3">
          {/* Item: My Location */}
          <div className="flex items-center justify-between">
            <div
              className={`flex-1 rounded border px-3 py-2 ${
                hasMyLocation ? 'opacity-100' : 'opacity-40 italic'
              }`}
            >
              A. {startLabel}
            </div>
          </div>
          {/* ✅ TAMPILKAN DAFTAR WAYPOINTS DI SINI */}
          {waypoints.map((waypoint, index) => (
            <div key={waypoint.id} className="flex items-center justify-between">
              {/* Nama Waypoint dengan nomor urut */}
              <div className="flex-1 rounded border border-blue-300 bg-blue-50 px-3 py-2">
                {String.fromCharCode(65 + (index + 1))}. {waypoint.name}
              </div>

              {/* ✅ Tombol Hapus HANYA muncul untuk item terakhir */}
              {index === waypoints.length - 1 && (
                <button
                  type="button"
                  title="Remove Last Destination"
                  onClick={() => onRemove(index)} // Panggil onRemove tanpa argumen
                  className="ml-2 inline-flex items-center justify-center h-9 w-9 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClear}                         // <<< PAKAI onClear
              className="px-3 py-2 rounded bg-amber-100 text-amber-700 hover:bg-amber-200"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onCloseClick}
              className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Done &amp; Close
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Find the First Destination */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold">Find the Next Destination</h3>
        <div className="mt-3">
          <p className="font-semibold mb-2">Select Category:</p>

          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.unique}
                onChange={() => handleToggle('unique')}
              />
              <span>Unique Attraction</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.attraction}
                onChange={() => handleToggle('attraction')}
              />
              <span>Attraction</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.homestay}
                onChange={() => handleToggle('homestay')}
              />
              <span>Homestay</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.culinary}
                onChange={() => handleToggle('culinary')}
              />
              <span>Culinary Place</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.worship}
                onChange={() => handleToggle('worship')}
              />
              <span>Worship Place</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked.souvenir}
                onChange={() => handleToggle('souvenir')}
              />
              <span>Souvenir Place</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1">Radius: {radius.toLocaleString()} m</p>
          <input
            type="range"
            min={0}
            max={3000}
            step={50}
            value={radius}
            onChange={(e) => handleRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          type="button"
          disabled={!canSearch}
          onClick={handleSearch}
          className={`mt-5 w-full rounded px-4 py-3 text-white ${
            canSearch
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Search Places
        </button>
      </div>
    </div>
  );
}
