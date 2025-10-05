import { useState } from 'react';
import { SearchPanel } from './components/SearchPanel';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ParticleBackground } from './components/ParticleBackground';

function App() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (location: string, date: string) => {
    setSelectedLocation(location);
    setSelectedDate(date);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setSelectedLocation('');
    setSelectedDate('');
  };

  return (
    <div className=" min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <ParticleBackground />

      <div className="relative z-10">
        {!showResults ? (
          <SearchPanel onSearch={handleSearch} />
        ) : (
          <WeatherDisplay
            location={selectedLocation}
            date={selectedDate}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
