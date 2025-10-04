import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, Clock3, X, Navigation, PartyPopper,CloudSun     } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SearchPanelProps {
  onSearch: (location: string, date: string, time: string) => void;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [event, setEvent] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMap && mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
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
          html: '<div style="width: 30px; height: 30px;"><div style="position: absolute; inset: 0; background: red; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div><svg style="position: relative; width: 30px; height: 30px; color: red; fill: red;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });
        
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
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
  }, [showMap]);

  const confirmLocation = async () => {
    if (selectedCoords) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedCoords.lat}&lon=${selectedCoords.lng}`
        );
        const data = await response.json();
        const locationName = data.address.city || data.address.town || data.address.village || data.address.state || 'Selected Location';
        setLocation(locationName);
      } catch (error) {
        setLocation(`${selectedCoords.lat.toFixed(2)}, ${selectedCoords.lng.toFixed(2)}`);
      }
      setShowMap(false);
    }
  };

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
              html: '<div style="width: 30px; height: 30px;"><div style="position: absolute; inset: 0; background: red; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div><svg style="position: relative; width: 30px; height: 30px; color: red; fill: red;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>',
              iconSize: [30, 30],
              iconAnchor: [15, 30]
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
            setShowMap(false);
          } catch (error) {
            setLocation(`${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`);
            setShowMap(false);
          }
        },
        (error) => {
          alert('Unable to get your location');
        }
      );
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="w-full max-w-2xl mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 blur-3xl bg-blue-500 opacity-30 animate-pulse"></div>
              <CloudSun    className="w-24 h-24 text-blue-400 relative z-10" />
            </div>

            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Predicting Tomorrow, From Space
            </h1>

            <p className="text-2xl text-blue-200 font-light tracking-wide mt-7">
               Harness NASA’s satellite data to forecast your perfect day.
            </p>
          </div>

          <div className="space-y-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <label className="flex items-center gap-3 text-blue-300 font-semibold mb-3">
                  <MapPin className="w-5 h-5" />
                  Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 rounded-xl px-4 py-4 text-left text-white hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 cursor-pointer flex items-center justify-between group/btn"
                >
                  <span className={location ? "text-white" : "text-blue-300/70"}>
                    {location || "Click to select location on map"}
                  </span>
                  <MapPin className="w-5 h-5 text-blue-400 group-hover/btn:text-blue-300 transition-colors" />
                </button>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <label className="flex items-center gap-3 text-blue-300 font-semibold mb-3">
                  <Calendar className="w-5 h-5" />
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-xl px-4 py-4 text-white hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 cursor-pointer [color-scheme:dark]"
                    required
                  />
                  
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <label className="flex items-center gap-3 text-pink-300 font-semibold mb-3">
                  <Clock3 className="w-5 h-5" />
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-pink-400/50 rounded-xl px-4 py-4 text-white hover:from-purple-500/30 hover:to-pink-500/30 hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 cursor-pointer [color-scheme:dark]"
                    required
                  />
                  
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <label className="flex items-center gap-3 text-orange-300 font-semibold mb-3">
                  <PartyPopper className="w-5 h-5" />
                  Event
                </label>
                <div className="relative">
                  <select
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full bg-gradient-to-r bg-orange-300 from-orange-500/20 to-rose-500/20 border-2 border-orange-400/50 rounded-xl px-4 py-4 text-white hover:from-orange-500/30 hover:to-rose-500/30 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 cursor-pointer appearance-none"
                    required
                  >
                    <option value="" className="bg-slate-800">Select an event</option>
                    <option value="BBQ" className="bg-slate-800">🔥 BBQ</option>
                    <option value="Camping" className="bg-slate-800">🏕️ Camping</option>
                    <option value="Fishing" className="bg-slate-800">🐟 Fishing</option>
                    <option value="Beach" className="bg-slate-800">🏖️ Beach</option>
                    <option value="Road Trip" className="bg-slate-800">🚗 Road Trip</option>
                    <option value="Hiking" className="bg-slate-800">🥾 Hiking</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                  <PartyPopper className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                if (location && date && time) {
                  onSearch(location, date, time);
                }
              }}
              className="w-full relative group overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl px-8 py-5 flex items-center justify-center gap-3 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                <Search className="w-6 h-6 text-white animate-pulse" />
                <span className="text-xl font-bold text-white tracking-wide">
                  Predict Weather Conditions
                </span>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex gap-8 text-sm text-blue-300/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Very Hot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span>Very Cold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Very Windy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span>Very Wet</span>
              </div>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  Select Location
                </h2>
                <button
                  onClick={() => setShowMap(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="mb-4 flex gap-3">
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Use My Location
                </button>
                <div className="flex-1 text-sm text-blue-300/70 flex items-center px-4">
                  {selectedCoords ? (
                    <span>Selected: {selectedCoords.lat.toFixed(4)}°, {selectedCoords.lng.toFixed(4)}°</span>
                  ) : (
                    <span>Click on the map to select a location</span>
                  )}
                </div>
              </div>

              <div 
                ref={mapContainerRef}
                className="w-full h-[310px] bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/10"
              />

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowMap(false)}
                  className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLocation}
                  disabled={!selectedCoords}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .animate-shimmer {
            animation: shimmer 3s linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
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
        `}</style>
      </div>
    </>
  );
}

export default SearchPanel;