import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, Clock3, Navigation, PartyPopper } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../index.css';
interface SearchPanelProps {
  onSearch: (location: string, date: string, time: string) => void;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [event, setEvent] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20, 0], 2);
      
     L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, &copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);




      
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setSelectedCoords({ lat, lng });
        
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: '<div style="width: 24px; height: 24px;"><div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div><div style="position: relative; width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; border: 3px solid white;"></div></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        
        // Reverse geocode to get location name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const locationName = data.address.city || data.address.town || data.address.village || data.address.state || 'Selected Location';
            setLocation(locationName);
          })
          .catch(() => {
            setLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
          });
      });
      
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedCoords(coords);
          
          if (mapRef.current) {
            mapRef.current.setView([coords.lat, coords.lng], 13);
            
            const L = (window as any).L;
            if (markerRef.current) {
              mapRef.current.removeLayer(markerRef.current);
            }
            
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: '<div style="width: 24px; height: 24px;"><div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div><div style="position: relative; width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; border: 3px solid white;"></div></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            
            markerRef.current = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapRef.current);
          }
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
            );
            const data = await response.json();
            const locationName = data.address.city || data.address.town || data.address.village || data.address.state || 'Your Location';
            setLocation(locationName);
          } catch (error) {
            setLocation(`${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`);
          }
        },
        (error) => {
          alert('Impossible d\'obtenir votre position');
        }
      );
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      
      <div className="min-h-screen flex flex-col items-center justify-start p-6 relative overflow-hidden bg-[#262626]">
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none ml-44 mr-44">
           <img
              src="/public/file.svg"
              alt="Illustration"
              className="w-full h-full object-cover"
            />
        </div>

        <div className="w-full max-w-5xl mt-16 relative z-10">
          <div className="text-center mt-20">
            <h1 className="font-questrial text-4xl font-bold text-white tracking-tight mb-2">
              Weather Prediction
            </h1>
            <p className="font-questrial text-sm text-gray-400">
              Harness NASA's satellite data to forecast your perfect day
            </p>
          </div>

          {/* Search Panel */}
          <div className="bg-[#36373a] backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Location */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  D'où partez-vous ?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Sélectionner un lieu"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 hover:border-gray-600 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={getCurrentLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <Calendar className="w-3 h-3" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white hover:border-gray-600 focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <Clock3 className="w-3 h-3" />
                  Heure
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white hover:border-gray-600 focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Event */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <PartyPopper className="w-3 h-3" />
                  Événement
                </label>
                <select
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white hover:border-gray-600 focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="" className="bg-gray-900">Sélectionner</option>
                  <option value="BBQ" className="bg-gray-900">🔥 BBQ</option>
                  <option value="Camping" className="bg-gray-900">🏕️ Camping</option>
                  <option value="Fishing" className="bg-gray-900">🐟 Pêche</option>
                  <option value="Beach" className="bg-gray-900">🏖️ Plage</option>
                  <option value="Road Trip" className="bg-gray-900">🚗 Road Trip</option>
                  <option value="Hiking" className="bg-gray-900">🥾 Randonnée</option>
                  <option value="Other" className="bg-gray-900">Autre</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                if (location && date && time) {
                  onSearch(location, date, time);
                }
              }}
              className="w-1/5 mx-auto bg-blue-600 hover:bg-blue-700 rounded-full px-6 py-3 flex items-center justify-center gap-2 transition-all mt-10"

            >
              <Search className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Rechercher</span>
            </button>
          </div>

          {/* Map */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium">Rechercher des destinations</h3>
              {selectedCoords && (
                <span className="text-xs text-gray-500">
                  {selectedCoords.lat.toFixed(4)}°, {selectedCoords.lng.toFixed(4)}°
                </span>
              )}
            </div>
            <div
              ref={mapContainerRef}
              className="w-full h-96 bg-gradient-to-br from-sky-500/40 via-sky-400/40 to-emerald-600/40 rounded-xl overflow-hidden border border-gray-700 shadow-inner"
            />

            <p className="text-xs text-gray-500 mt-3 text-center">
              Cliquez sur la carte pour sélectionner un lieu
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Trouvez des conditions météo parfaites pour votre événement
            </p>
          </div>
        </div>

        <style>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .custom-marker {
            background: transparent;
            border: none;
          }
          .leaflet-container {
            background: #111827;
          }
        `}</style>
      </div>
    </>
  );
}

export default SearchPanel;