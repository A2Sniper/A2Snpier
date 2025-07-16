'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Target, BarChart3, Copy, Check } from 'lucide-react';
import { Signal } from '@/lib/mock-data';
import { TradingViewChart } from './tradingview-chart';

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const [showChart, setShowChart] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculer le temps restant
  useEffect(() => {
    const updateTimeRemaining = () => {
      if (signal.status !== 'ACTIVE') {
        setTimeRemaining('');
        return;
      }

      const now = new Date().getTime();
      const signalTime = new Date(signal.timestamp).getTime();
      const expirationTime = signalTime + (signal.expiration * 60 * 1000);
      const remaining = expirationTime - now;

      if (remaining <= 0) {
        setTimeRemaining('Expiré');
        return;
      }

      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [signal.timestamp, signal.expiration, signal.status]);

  const handleCopy = async () => {
    const signalText = `
🎯 SIGNAL A2Sniper
Paire: ${signal.pair}
Direction: ${signal.direction}
Confiance: ${signal.confidence}%
Expiration: ${signal.expiration}min
Prix d'entrée: ${signal.entry_price}
    `.trim();

    try {
      await navigator.clipboard.writeText(signalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const getStatusColor = (status: Signal['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-500';
      case 'WON':
        return 'bg-green-500';
      case 'LOST':
        return 'bg-red-500';
      case 'EXPIRED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Signal['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'WON':
        return 'Gagné';
      case 'LOST':
        return 'Perdu';
      case 'EXPIRED':
        return 'Expiré';
      default:
        return status;
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card-dark rounded-xl p-6 shadow-lg hover:shadow-xl smooth-transition"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              signal.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {signal.direction === 'CALL' ? 
                <TrendingUp className="w-5 h-5 text-white" /> : 
                <TrendingDown className="w-5 h-5 text-white" />
              }
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{signal.pair}</h3>
              <p className="text-sm text-gray-400">
                {signal.timestamp.toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(signal.status)}`}>
              {getStatusText(signal.status)}
            </span>
          </div>
        </div>

        {signal.status === 'ACTIVE' && timeRemaining && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-mono">
              {timeRemaining}
            </span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {new Date(signal.timestamp).toLocaleString('fr-FR')}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Confiance</span>
            </div>
            <div className="text-xl font-bold text-white">{signal.confidence}%</div>
            <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full smooth-transition"
                style={{ width: `${signal.confidence}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Expiration</span>
            </div>
            <div className="text-xl font-bold text-white">{signal.expiration} min</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Prix d'entrée</span>
            <span className="text-sm font-medium text-white">{signal.entry_price.toFixed(5)}</span>
          </div>
          
          {signal.result_price && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Prix de sortie</span>
              <span className="text-sm font-medium text-white">{signal.result_price.toFixed(5)}</span>
            </div>
          )}
          
          {signal.profit_loss && (
            <div className="flex justify-between items-center pt-2 border-t border-slate-600">
              <span className="text-sm text-gray-400">Résultat</span>
              <span className={`text-sm font-bold ${
                signal.profit_loss > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {signal.profit_loss > 0 ? '+' : ''}${signal.profit_loss.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              Expiration: {signal.expiration}min
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChart(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Graphique</span>
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copié!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Direction: {signal.direction}</span>
            <span className="text-xs text-gray-500">ID: {signal.id}</span>
          </div>
        </div>
      </motion.div>

      {/* Modal TradingView */}
      {showChart && (
        <TradingViewChart
          symbol={signal.pair}
          onClose={() => setShowChart(false)}
        />
      )}
    </>
  );
}