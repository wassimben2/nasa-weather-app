import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Wind, CloudRain, Sun, Snowflake, AlertTriangle } from 'lucide-react';
import { WeatherCard } from './WeatherCard';

interface WeatherDisplayProps {
  location: string;
  date: string;
  onReset: () => void;
}

interface WeatherCondition {
  type: 'hot' | 'cold' | 'windy' | 'wet' | 'comfortable';
  likelihood: number;
  icon: any;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

export function WeatherDisplay({ location, date, onReset }: WeatherDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conditions, setConditions] = useState<WeatherCondition[]>([]);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const mockConditions: WeatherCondition[] = [
        {
          type: 'hot',
          likelihood: Math.floor(Math.random() * 100),
          icon: Thermometer,
          title: 'Very Hot',
          description: 'High temperatures expected',
          color: 'from-orange-500 to-red-500',
          gradient: 'from-orange-500/20 to-red-500/20'
        },
        {
          type: 'cold',
          likelihood: Math.floor(Math.random() * 100),
          icon: Snowflake,
          title: 'Very Cold',
          description: 'Low temperatures expected',
          color: 'from-cyan-500 to-blue-500',
          gradient: 'from-cyan-500/20 to-blue-500/20'
        },
        {
          type: 'windy',
          likelihood: Math.floor(Math.random() * 100),
          icon: Wind,
          title: 'Very Windy',
          description: 'Strong winds expected',
          color: 'from-teal-500 to-emerald-500',
          gradient: 'from-teal-500/20 to-emerald-500/20'
        },
        {
          type: 'wet',
          likelihood: Math.floor(Math.random() * 100),
          icon: CloudRain,
          title: 'Very Wet',
          description: 'Heavy precipitation expected',
          color: 'from-blue-500 to-indigo-500',
          gradient: 'from-blue-500/20 to-indigo-500/20'
        },
        {
          type: 'comfortable',
          likelihood: Math.floor(Math.random() * 100),
          icon: Sun,
          title: 'Comfortable',
          description: 'Pleasant conditions expected',
          color: 'from-amber-500 to-yellow-500',
          gradient: 'from-amber-500/20 to-yellow-500/20'
        }
      ];

      setConditions(mockConditions);
      setIsLoading(false);
    }, 2000);
  }, [location, date]);

  const getOverallRisk = () => {
    const adverseConditions = conditions.filter(c =>
      (c.type === 'hot' || c.type === 'cold' || c.type === 'windy' || c.type === 'wet') &&
      c.likelihood > 60
    );
    return adverseConditions.length;
  };

  return (
    <div className="min-h-screen p-6 pt-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onReset}
          className="group mb-8 flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-all duration-300 transform hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-semibold">New Search</span>
        </button>

        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-4">
            <span className="text-blue-300 font-semibold">{location}</span>
            <span className="text-blue-400 mx-3">•</span>
            <span className="text-blue-300 font-semibold">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Weather Forecast Analysis
          </h2>

          {!isLoading && (
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-full">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">
                {getOverallRisk()} High-Risk Condition{getOverallRisk() !== 1 ? 's' : ''} Detected
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-2xl text-blue-300 font-semibold animate-pulse">
              Analyzing atmospheric data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition, index) => (
              <WeatherCard
                key={condition.type}
                condition={condition}
                delay={index * 100}
              />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="mt-12 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">Recommendation</h3>
            <p className="text-blue-200 text-lg leading-relaxed">
              {getOverallRisk() === 0 && "Perfect conditions for your outdoor activity! No adverse weather expected."}
              {getOverallRisk() === 1 && "Generally favorable conditions with one potential concern. Plan accordingly and monitor updates."}
              {getOverallRisk() === 2 && "Moderate risk detected. Consider bringing appropriate gear and have a backup plan."}
              {getOverallRisk() >= 3 && "Multiple adverse conditions expected. Consider rescheduling your outdoor activity for safety."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
