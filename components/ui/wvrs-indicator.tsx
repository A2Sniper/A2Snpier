import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Volume2, Target, Zap } from 'lucide-react';

interface WVRSIndicatorProps {
  signal: {
    confidence: number;
    wick_percentage?: number;
    volume_ratio?: number;
    context_zone?: string;
    direction: 'CALL' | 'PUT';
  };
  className?: string;
}

export const WVRSIndicator: React.FC<WVRSIndicatorProps> = ({ signal, className = '' }) => {
  const isWVRSSignal = signal.wick_percentage && signal.volume_ratio;
  
  if (!isWVRSSignal) return null;

  const getWVRSStrength = (confidence: number) => {
    if (confidence >= 95) return { label: 'TRÈS FORT', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (confidence >= 90) return { label: 'FORT', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (confidence >= 85) return { label: 'MODÉRÉ', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'FAIBLE', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const strength = getWVRSStrength(signal.confidence);
  const DirectionIcon = signal.direction === 'CALL' ? TrendingUp : TrendingDown;
  const directionColor = signal.direction === 'CALL' ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${strength.bg} border border-gray-600 rounded-lg p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">WVRS</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.color}`}>
          <DirectionIcon className="w-4 h-4" />
          <span className="text-xs font-bold">{strength.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-gray-400">Mèche</span>
          </div>
          <div className={strength.color}>
            {signal.wick_percentage?.toFixed(1)}%
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Volume2 className="w-3 h-3 text-purple-400" />
            <span className="text-gray-400">Volume</span>
          </div>
          <div className={strength.color}>
            {signal.volume_ratio?.toFixed(1)}x
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-gray-400">Zone</span>
          </div>
          <div className={strength.color}>
            {signal.context_zone || 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Rejet institutionnel</span>
          <div className={`px-2 py-1 rounded ${strength.bg} ${strength.color} font-bold`}>
            {signal.confidence}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WVRSIndicator;