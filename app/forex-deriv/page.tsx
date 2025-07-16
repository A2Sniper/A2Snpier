'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3, Zap, Shield, Users, Star, ExternalLink, Play, Pause, Settings, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';

interface UnifiedSignal {
  id: string;
  timestamp: Date;
  platform: 'OANDA' | 'DERIV';
  instrument: string;
  symbol_display: string;
  action: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  position_size: number;
  risk_percentage: number;
  confidence: number;
  risk_reward_ratio: number;
  expected_pips: number;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  platform_specific: {
    oanda?: {
      lot_size: number;
      swap_rates: number;
    };
    deriv?: {
      leverage: number;
      margin_required: number;
      trade_type: 'cfd' | 'forex' | 'commodities' | 'synthetic';
    };
  };
}

interface Account {
  id: string;
  platform: 'OANDA' | 'DERIV';
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  margin_level: number;
  profit_loss: number;
  open_positions: number;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export default function ForexDerivPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'OANDA' | 'DERIV'>('ALL');
  const [signals, setSignals] = useState<UnifiedSignal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockAccounts: Account[] = [
      {
        id: 'oanda_1',
        platform: 'OANDA',
        balance: 10000,
        equity: 10250,
        margin: 500,
        free_margin: 9750,
        margin_level: 2050,
        profit_loss: 250,
        open_positions: 3,
        status: 'CONNECTED'
      },
      {
        id: 'deriv_1',
        platform: 'DERIV',
        balance: 5000,
        equity: 5150,
        margin: 200,
        free_margin: 4950,
        margin_level: 2575,
        profit_loss: 150,
        open_positions: 2,
        status: 'CONNECTED'
      }
    ];

    const mockSignals: UnifiedSignal[] = [
      {
        id: 'signal_1',
        timestamp: new Date(),
        platform: 'OANDA',
        instrument: 'EUR_USD',
        symbol_display: 'EUR/USD',
        action: 'BUY',
        entry_price: 1.0825,
        stop_loss: 1.0800,
        take_profit: 1.0875,
        position_size: 10000,
        risk_percentage: 2,
        confidence: 87,
        risk_reward_ratio: 2.0,
        expected_pips: 50,
        timeframe: '1h',
        status: 'ACTIVE',
        platform_specific: {
          oanda: {
            lot_size: 0.1,
            swap_rates: -0.5
          }
        }
      },
      {
        id: 'signal_2',
        timestamp: new Date(Date.now() - 300000),
        platform: 'DERIV',
        instrument: 'frxEURUSD',
        symbol_display: 'EUR/USD',
        action: 'SELL',
        entry_price: 1.0820,
        stop_loss: 1.0845,
        take_profit: 1.0770,
        position_size: 500,
        risk_percentage: 2,
        confidence: 92,
        risk_reward_ratio: 2.0,
        expected_pips: 50,
        timeframe: '15m',
        status: 'ACTIVE',
        platform_specific: {
          deriv: {
            leverage: 100,
            margin_required: 5,
            trade_type: 'forex'
          }
        }
      }
    ];

    setAccounts(mockAccounts);
    setSignals(mockSignals);
  }, []);

  const filteredSignals = selectedPlatform === 'ALL' 
    ? signals 
    : signals.filter(s => s.platform === selectedPlatform);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalProfit = accounts.reduce((sum, acc) => sum + acc.profit_loss, 0);
  const totalPositions = accounts.reduce((sum, acc) => sum + acc.open_positions, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Données mises à jour !';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }, 1500);
  };

  const formatPositionSize = (signal: UnifiedSignal): string => {
    if (signal.platform === 'OANDA') {
      const lotSize = signal.platform_specific.oanda?.lot_size || 0;
      return `${signal.position_size} unités (${lotSize} lots)`;
    } else {
      return `$${signal.position_size}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="md:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Forex & Deriv Trading
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Trading unifié sur OANDA et Deriv avec signaux IA
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="ALL">Toutes les plateformes</option>
                  <option value="OANDA">OANDA</option>
                  <option value="DERIV">Deriv</option>
                </select>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsAutoTrading(!isAutoTrading)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isAutoTrading 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isAutoTrading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAutoTrading ? 'Pause' : 'Auto'}</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance Totale</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalBalance.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P&L Total</p>
                  <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Positions Ouvertes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPositions}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Signaux Actifs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredSignals.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Accounts Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Comptes de Trading
              </h3>
              
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          account.platform === 'OANDA' ? 'bg-blue-500' : 'bg-purple-500'
                        }`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">{account.platform}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          account.status === 'CONNECTED' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Balance</div>
                        <div className="font-medium text-gray-900 dark:text-white">${account.balance.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Equity</div>
                        <div className="font-medium text-gray-900 dark:text-white">${account.equity.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Marge Libre</div>
                        <div className="font-medium text-gray-900 dark:text-white">${account.free_margin.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">P&L</div>
                        <div className={`font-medium ${
                          account.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {account.profit_loss >= 0 ? '+' : ''}${account.profit_loss.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Active Signals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Signaux Unifiés
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredSignals.map((signal) => (
                  <div key={signal.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          signal.platform === 'OANDA' ? 'bg-blue-500' : 'bg-purple-500'
                        }`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">{signal.symbol_display}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          signal.action === 'BUY' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {signal.action}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{signal.platform}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{signal.confidence}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Entrée</div>
                        <div className="font-medium text-gray-900 dark:text-white">{signal.entry_price}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Stop Loss</div>
                        <div className="font-medium text-red-600">{signal.stop_loss}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Take Profit</div>
                        <div className="font-medium text-green-600">{signal.take_profit}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600 dark:text-gray-400">
                        {formatPositionSize(signal)} • R:R {signal.risk_reward_ratio.toFixed(2)}:1
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                        Trader
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Platform Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Trading Unifié OANDA & Deriv</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Une seule interface pour trader sur les deux plateformes les plus populaires du marché
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Signaux Unifiés</h4>
                <p className="text-sm text-blue-100">Format unique pour toutes les plateformes</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Gestion des Risques</h4>
                <p className="text-sm text-blue-100">Money management automatisé</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Multi-Comptes</h4>
                <p className="text-sm text-blue-100">Gérez plusieurs comptes simultanément</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <p className="text-sm text-blue-100">Suivi unifié des performances</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.oanda.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  <span>Connecter OANDA</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://deriv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                >
                  <span>Connecter Deriv</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Legal Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5">
                ⚠️
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  AVERTISSEMENT SUR LES RISQUES
                </h4>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                  <p>
                    Le trading de devises, CFDs et instruments financiers comporte un risque élevé de perte. 
                    Les performances passées ne garantissent pas les résultats futurs.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vous pourriez perdre tout votre capital investi</li>
                    <li>L'effet de levier augmente les gains potentiels mais aussi les pertes</li>
                    <li>Assurez-vous de comprendre les risques avant de trader</li>
                    <li>Ne tradez qu'avec de l'argent que vous pouvez vous permettre de perdre</li>
                  </ul>
                  <p className="font-medium">
                    A2Sniper fournit des signaux à titre informatif uniquement. 
                    Les décisions de trading relèvent entièrement de votre responsabilité.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}