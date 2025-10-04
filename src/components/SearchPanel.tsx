import { useState } from 'react';
import { MapPin, Calendar, Search, Sparkles } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (location: string, date: string) => void;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && date) {
      onSearch(location, date);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500 opacity-30 animate-pulse"></div>
            <Sparkles className="w-20 h-20 text-blue-400 relative animate-float" />
          </div>

          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            Nasa's Space App Challenge
          </h1>

          <p className="text-2xl text-blue-200 font-light tracking-wide">
            Will it rain on my Parade
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
              <label className="flex items-center gap-3 text-blue-300 font-semibold mb-3">
                <MapPin className="w-5 h-5" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, trail, or lake name..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
              <label className="flex items-center gap-3 text-blue-300 font-semibold mb-3">
                <Calendar className="w-5 h-5" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
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
        </form>

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
    </div>
  );
}
