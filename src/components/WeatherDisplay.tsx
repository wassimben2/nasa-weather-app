import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Wind, CloudRain, Sun, Snowflake, AlertTriangle, Droplets, Cloud } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

function WeatherCard({ condition, delay }: { condition: WeatherCondition; delay: number }) {
  const Icon = condition.icon;

  return (
    <div
      className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundImage: `linear-gradient(135deg, ${condition.gradient})` }}
      ></div>

      <div className="relative z-10">
        <div
          className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${condition.color} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 text-center group-hover:scale-105 transition-transform duration-300">
          {condition.title}
        </h3>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-200 font-semibold">Likelihood</span>
            <span className="text-2xl font-bold text-white">{condition.likelihood}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full bg-gradient-to-r ${condition.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
              style={{ width: `${condition.likelihood}%` }}
            ></div>
          </div>
        </div>

        <p className="text-blue-200 text-center text-sm leading-relaxed">{condition.description}</p>

        {condition.likelihood > 60 && (
          <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-xs font-semibold">High Risk</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function WeatherDisplay({ location, date, onReset }: WeatherDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conditions, setConditions] = useState<WeatherCondition[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Données météo simulées
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [windSpeed, setWindSpeed] = useState<number>(0);
  const [precipitationChance, setPrecipitationChance] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const temp = 15 + Math.random() * 25; // entre 15 et 40°C
      const hum = 50 + Math.random() * 40; // entre 50 et 90 %
      const wind = 10 + Math.random() * 40; // entre 10 et 50 km/h
      const rain = Math.random() * 100; // %

      setTemperature(temp);
      setHumidity(hum);
      setWindSpeed(wind);
      setPrecipitationChance(rain);

      const mockConditions: WeatherCondition[] = [
        {
          type: 'hot',
          likelihood: temp > 30 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40),
          icon: Thermometer,
          title: 'Very Hot',
          description: 'High temperatures expected',
          color: 'from-orange-500 to-red-500',
          gradient: 'from-orange-500/20 to-red-500/20',
        },
        {
          type: 'cold',
          likelihood: temp < 10 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40),
          icon: Snowflake,
          title: 'Very Cold',
          description: 'Low temperatures expected',
          color: 'from-cyan-500 to-blue-500',
          gradient: 'from-cyan-500/20 to-blue-500/20',
        },
        {
          type: 'windy',
          likelihood: wind > 30 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40),
          icon: Wind,
          title: 'Very Windy',
          description: 'Strong winds expected',
          color: 'from-teal-500 to-emerald-500',
          gradient: 'from-teal-500/20 to-emerald-500/20',
        },
        {
          type: 'wet',
          likelihood: rain > 50 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40),
          icon: CloudRain,
          title: 'Very Wet',
          description: 'Heavy precipitation expected',
          color: 'from-blue-500 to-indigo-500',
          gradient: 'from-blue-500/20 to-indigo-500/20',
        },
        {
          type: 'comfortable',
          likelihood: temp >= 18 && temp <= 27 && wind < 25 && rain < 30 ? 90 : 30,
          icon: Sun,
          title: 'Comfortable',
          description: 'Pleasant conditions expected',
          color: 'from-amber-500 to-yellow-500',
          gradient: 'from-amber-500/20 to-yellow-500/20',
        },
      ];

      // Données historiques
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const historical = months.map((month, index) => ({
        month,
        temperature: 15 + Math.sin((index * Math.PI) / 6) * 15 + Math.random() * 5,
        precipitation: 30 + Math.random() * 40,
        windSpeed: 15 + Math.random() * 20,
      }));

      setConditions(mockConditions);
      setHistoricalData(historical);
      setIsLoading(false);
    }, 2000);
  }, [location, date]);

  const getOverallRisk = () => {
    const adverseConditions = conditions.filter(
      (c) => (c.type === 'hot' || c.type === 'cold' || c.type === 'windy' || c.type === 'wet') && c.likelihood > 60
    );
    return adverseConditions.length;
  };

  // Recommandation personnalisée avec le lieu
  const getRecommendation = () => {
    const prefix = `À ${location}, `;
     if (temperature < 5) {
    return `${prefix}conditions are very cold – hiking could be risky. Wear warm layers and consider rescheduling.`;
    } else if (temperature > 35) {
      return `${prefix}temperatures are extremely high for hiking – risk of heat exhaustion. Avoid long hikes.`;
    } else if (precipitationChance > 60) {
      return `${prefix}heavy rainfall is expected – trails may be slippery. Bring waterproof gear.`;
    } else if (windSpeed > 40) {
      return `${prefix}strong winds are forecast – certain areas (like ridges or cliffs) may be dangerous. Stay cautious.`;
    } else if (humidity > 85) {
      return `${prefix}humidity levels are high – expect discomfort and a higher risk of dehydration. Stay hydrated.`;
    } else if (
      temperature >= 18 &&
      temperature <= 27 &&
      precipitationChance < 30 &&
      windSpeed < 25
    ) {
      return `${prefix}conditions are ideal for hiking – enjoy your adventure!`;
    } else {
      return `${prefix}conditions are moderate – suitable for hiking with proper gear.`;
    }
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

        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-4">
            <span className="text-blue-300 font-semibold">{location}</span>
            <span className="text-blue-400 mx-3">•</span>
            <span className="text-blue-300 font-semibold">
              {new Date(date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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

        {/* Recommendation */}
        {!isLoading && (
          <div className="mt-12 mb-12 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">Outdoor Conditions</h3>
            <p className="text-blue-200 text-lg leading-relaxed">{getRecommendation()}</p>
          </div>
        )}

        {/* Additional Info */}
        {!isLoading && (
          <div className="mt-12 mb-11 backdrop-blur-xl bg-white/5 rounded-2xl p-10 border border-white/10">
            <div className="grid md:grid-cols-5 gap-8 text-center">
              <InfoCard icon={Thermometer} title="Temperature Range" value={`${temperature.toFixed(1)}°C`} color="from-cyan-500 to-blue-600" />
              <InfoCard icon={Droplets} title="Humidity" value={`${humidity.toFixed(0)}%`} color="from-blue-500 to-teal-600" />
              <InfoCard icon={Wind} title="Wind Speed" value={`${windSpeed.toFixed(1)} km/h`} color="from-teal-500 to-emerald-600" />
              <InfoCard icon={Cloud} title="Air Quality" value="AQI 42 (Good)" color="from-indigo-500 to-purple-600" />
              <InfoCard icon={CloudRain} title="Precipitation" value={`${precipitationChance.toFixed(0)}% chance`} color="from-sky-500 to-blue-700" />
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 mt-11">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-2xl text-blue-300 font-semibold animate-pulse">Analyzing atmospheric data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition, index) => (
              <WeatherCard key={condition.type} condition={condition} delay={index * 100} />
            ))}
          </div>
        )}

        {/* Historical Trends */}
        {!isLoading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mt-11 mr-20 ml-20">
            <h3 className="text-2xl font-bold text-blue-300 mb-6">62-days Historical Weather Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#93c5fd" tick={{ fill: '#93c5fd' }} />
                <YAxis stroke="#93c5fd" tick={{ fill: '#93c5fd' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#93c5fd' }}
                />
                <Legend wrapperStyle={{ color: '#93c5fd' }} />
                <Area type="monotone" dataKey="temperature" stackId="1" stroke="#f97316" fill="#f9731650" name="Temperature (°C)" />
                <Area type="monotone" dataKey="precipitation" stackId="2" stroke="#3b82f6" fill="#3b82f650" name="Precipitation (mm)" />
                <Area type="monotone" dataKey="windSpeed" stackId="3" stroke="#14b8a6" fill="#14b8a650" name="Wind Speed (km/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// Sous-composant pour éviter la répétition
function InfoCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="group hover:scale-105 transition-transform duration-300">
      <div
        className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400">{value}</p>
    </div>
  );
}
