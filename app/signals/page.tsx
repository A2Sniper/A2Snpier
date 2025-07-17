'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { useAppStore } from '@/lib/store';
import { SignalCard } from '@/components/ui/signal-card';
import { TradingViewChart } from '@/components/ui/tradingview-chart';
import { AuthModal } from '@/components/ui/auth-modal';
import { CandlestickAnimation } from '@/components/ui/candlestick-animation';
import { Filter, Search, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function SignalsPage() {
  const { signals, isAuthenticated } = useAppStore();
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSignals = signals.filter(signal => {
    const matchesFilter = filter === 'all' || signal.action.toLowerCase() === filter;
    const matchesSearch = signal.pair.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewChart = (signal: any) => {
    setSelectedSignal(signal);
    setShowChart(true);
  };

  const stats = {
    total: signals.length,
    buy: signals.filter(s => s.action === 'BUY').length,
    sell: signals.filter(s => s.action === 'SELL').length,
    active: signals.filter(s => s.status === 'active').length
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
          <CandlestickAnimation />
          <div className="relative z-10 text-center">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Signaux de Trading</h1>
              <p className="text-gray-300 mb-6">
                Accédez aux signaux de trading en temps réel générés par notre IA
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Se connecter pour voir les signaux
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <CandlestickAnimation />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Signaux de Trading</h1>
            <p className="text-gray-400">Signaux générés par l'IA en temps réel</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une paire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter('buy')}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                  filter === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                BUY
              </button>
              <button
                onClick={() => setFilter('sell')}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                  filter === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                SELL
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Signaux</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Signaux BUY</p>
                <p className="text-2xl font-bold text-green-400">{stats.buy}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Signaux SELL</p>
                <p className="text-2xl font-bold text-red-400">{stats.sell}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Actifs</p>
                <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onViewChart={handleViewChart}
            />
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun signal trouvé</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Essayez un autre terme de recherche' : 'Aucun signal disponible pour le moment'}
            </p>
          </div>
        )}
      </div>

      {/* TradingView Chart Modal */}
      <TradingViewChart
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        symbol={selectedSignal?.pair || 'EURUSD'}
      />
    </div>
  );
}