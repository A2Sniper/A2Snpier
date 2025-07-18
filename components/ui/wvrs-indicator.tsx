'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, Volume2, Target } from 'lucide-react';

interface WVRSIndicatorProps {
  confidence: number;
  wickPercentage: number;
  volumeRatio: number;
  contextZone?: string;
  direction: 'BUY' | 'SELL';
}

export function WVRSIndicator({ 
  confidence, 
  wickPercentage, 
  volumeRatio, 
  contextZone, 
  direction 
}: WVRSIndicatorProps) {
  if (confidence < 90) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg border-2 border-green-400"
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5 text-yellow-300" />
        </div>
        <div>
          <h3 className="font-bold text-lg">WVRS Strategy</h3>
          <p className="text-green-100 text-sm">Mèche Institutionnelle Détectée</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Direction</span>
          </div>
          <div className="text-lg font-bold">{direction}</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Confiance</span>
          </div>
          <div className="text-lg font-bold">{confidence}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <span>🕯️</span>
            <span>Mèche</span>
          </div>
          <div className="font-medium">{wickPercentage.toFixed(1)}%</div>
        </div>

        <div>
          <div className="flex items-center space-x-1 mb-1">
            <Volume2 className="w-3 h-3" />
            <span>Volume</span>
          </div>
          <div className="font-medium">{volumeRatio.toFixed(2)}x</div>
        </div>
      </div>

      {contextZone && (
        <div className="mt-3 bg-white/10 rounded-lg p-2">
          <div className="text-xs text-green-100">Zone détectée</div>
          <div className="font-medium">{contextZone}</div>
        </div>
      )}

      <div className="mt-3 text-xs text-green-100">
        ⚡ Signal institutionnel de haute précision
      </div>
    </motion.div>
  );
}