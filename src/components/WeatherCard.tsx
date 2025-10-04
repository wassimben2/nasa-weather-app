import { useState, useEffect } from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface WeatherCondition {
  type: string;
  likelihood: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

interface WeatherCardProps {
  condition: WeatherCondition;
  delay: number;
}

export function WeatherCard({ condition, delay }: WeatherCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedLikelihood, setAnimatedLikelihood] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      let current = 0;
      const increment = condition.likelihood / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= condition.likelihood) {
          setAnimatedLikelihood(condition.likelihood);
          clearInterval(timer);
        } else {
          setAnimatedLikelihood(Math.floor(current));
        }
      }, 20);

      return () => clearInterval(timer);
    }
  }, [isVisible, condition.likelihood]);

  const getRiskLevel = (likelihood: number) => {
    if (likelihood >= 80) return 'EXTREME';
    if (likelihood >= 60) return 'HIGH';
    if (likelihood >= 40) return 'MODERATE';
    if (likelihood >= 20) return 'LOW';
    return 'MINIMAL';
  };

  const getRiskColor = (likelihood: number) => {
    if (likelihood >= 80) return 'text-red-400';
    if (likelihood >= 60) return 'text-orange-400';
    if (likelihood >= 40) return 'text-yellow-400';
    if (likelihood >= 20) return 'text-blue-400';
    return 'text-green-400';
  };

  const Icon = condition.icon;

  return (
    <div
      className={`group relative transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${condition.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>

      <div className={`relative bg-gradient-to-br ${condition.gradient} backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform transition-all duration-500 hover:scale-[1.05] hover:border-white/40`}>
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 bg-gradient-to-br ${condition.color} rounded-2xl transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <div className="text-right">
            <div className={`text-sm font-bold ${getRiskColor(condition.likelihood)} mb-1`}>
              {getRiskLevel(condition.likelihood)}
            </div>
            <div className="text-xs text-blue-300/70">RISK LEVEL</div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{condition.title}</h3>
        <p className="text-blue-200/80 mb-6">{condition.description}</p>

        <div className="relative">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-semibold text-blue-300">Likelihood</span>
            <span className={`text-4xl font-bold ${getRiskColor(condition.likelihood)} transition-all duration-300`}>
              {animatedLikelihood}%
            </span>
          </div>

          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${condition.color} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${animatedLikelihood}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>

          <div className="mt-4 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  i < Math.floor(animatedLikelihood / 10)
                    ? `bg-gradient-to-r ${condition.color}`
                    : 'bg-white/10'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
