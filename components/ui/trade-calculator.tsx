'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, TrendingUp, DollarSign } from 'lucide-react';

interface Trade {
  id: number;
  result: 'win' | 'loss' | '';
  amount: number;
  return: number;
  balance: number;
}

interface TradeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TradeCalculator({ isOpen, onClose }: TradeCalculatorProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [sessionCounter, setSessionCounter] = useState(0);
  const [initialCapital, setInitialCapital] = useState(3750.74);
  const [payoutPercent, setPayoutPercent] = useState(92);
  const [maxLossLimit, setMaxLossLimit] = useState(10);
  const [profitTarget, setProfitTarget] = useState(2);
  const [sessionsRequired, setSessionsRequired] = useState(1);

  // Initialiser les trades
  useEffect(() => {
    const initialTrades: Trade[] = [];
    for (let i = 1; i <= 20; i++) {
      initialTrades.push({
        id: i,
        result: '',
        amount: 0,
        return: 0,
        balance: 0
      });
    }
    setTrades(initialTrades);
  }, []);

  // Calculer les balances
  const updateBalances = (updatedTrades: Trade[]) => {
    let currentBalance = initialCapital;
    
    const newTrades = updatedTrades.map(trade => {
      if (trade.result && trade.amount > 0) {
        if (trade.result === 'win') {
          currentBalance += trade.return;
        } else if (trade.result === 'loss') {
          currentBalance -= trade.amount;
        }
      }
      return { ...trade, balance: currentBalance };
    });
    
    setTrades(newTrades);
  };

  const updateTrade = (index: number, field: keyof Trade, value: any) => {
    const updatedTrades = [...trades];
    updatedTrades[index] = { ...updatedTrades[index], [field]: value };
    updateBalances(updatedTrades);
  };

  const clearTrades = () => {
    const clearedTrades = trades.map(trade => ({
      ...trade,
      result: '' as const,
      amount: 0,
      return: 0,
      balance: 0
    }));
    setTrades(clearedTrades);
  };

  // Calculs
  const totalTrades = trades.filter(t => t.result && t.amount > 0).length;
  const winTrades = trades.filter(t => t.result === 'win').length;
  const totalProfit = trades.reduce((sum, t) => t.result === 'win' ? sum + t.return : sum, 0);
  const totalLoss = trades.reduce((sum, t) => t.result === 'loss' ? sum + t.amount : sum, 0);
  const finalCapital = initialCapital + totalProfit - totalLoss;
  const accountGain = ((finalCapital - initialCapital) / initialCapital * 100);
  const stopLoss = initialCapital * 0.8;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold tracking-wider">A2SNIPER TRADE MANAGER</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Section des trades */}
            <div className="xl:col-span-3 bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-5 gap-4 bg-gray-700 p-4 rounded-lg mb-4 text-sm font-bold">
                <div>NO.</div>
                <div>RESULT</div>
                <div>TRADE AMOUNT</div>
                <div>RETURN</div>
                <div>CURRENT BALANCE</div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {trades.map((trade, index) => (
                  <div key={trade.id} className="grid grid-cols-5 gap-4 p-3 hover:bg-gray-700 rounded-lg text-sm">
                    <div className="flex items-center">{trade.id}</div>
                    <div>
                      <select
                        value={trade.result}
                        onChange={(e) => updateTrade(index, 'result', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white p-2 rounded text-sm w-full"
                      >
                        <option value="">-</option>
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={trade.amount || ''}
                        onChange={(e) => updateTrade(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="$0.00"
                        step="0.01"
                        className="bg-gray-700 border border-gray-600 text-white p-2 rounded text-sm w-full"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={trade.return || ''}
                        onChange={(e) => updateTrade(index, 'return', parseFloat(e.target.value) || 0)}
                        placeholder="$0.00"
                        step="0.01"
                        className="bg-gray-700 border border-gray-600 text-white p-2 rounded text-sm w-full"
                      />
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-right">
                      {trade.result && trade.amount > 0 ? `$${trade.balance.toFixed(2)}` : '-'}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={clearTrades}
                className="mt-4 bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                CLEAR
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* New Session Button */}
              <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all">
                + NEW SESSION
              </button>

              {/* Calculations Panel */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-center font-bold mb-4 pb-2 border-b border-gray-600">CALCULATIONS</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Initial Capital</span>
                    <input
                      type="number"
                      value={initialCapital}
                      onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-20 text-right text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Total Trades</span>
                    <div className="bg-gray-700 p-1 rounded w-20 text-right">{totalTrades}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Win Trades</span>
                    <div className="bg-gray-700 p-1 rounded w-20 text-right">{winTrades}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Payout %</span>
                    <input
                      type="number"
                      value={payoutPercent}
                      onChange={(e) => setPayoutPercent(parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-20 text-right text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Currency</span>
                    <select className="bg-gray-700 border border-gray-600 text-white p-1 rounded text-sm">
                      <option>USD ($)</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Capital Final</span>
                    <div className="bg-gray-700 p-1 rounded w-20 text-right">${finalCapital.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Account Gain</span>
                    <div className="bg-gray-700 p-1 rounded w-20 text-right">{accountGain.toFixed(2)}%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Win Profit</span>
                    <div className="bg-green-600 p-1 rounded w-20 text-right">${totalProfit.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Stop Loss</span>
                    <div className="bg-gray-700 p-1 rounded w-20 text-right">${stopLoss.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Max Loss Limit</span>
                    <input
                      type="number"
                      value={maxLossLimit}
                      onChange={(e) => setMaxLossLimit(parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-20 text-right text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Session Controls */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-sm mb-2">LOG SESSION</div>
                <div className="text-sm mb-4">SESSION COUNTER</div>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setSessionCounter(Math.max(0, sessionCounter - 1))}
                    className="bg-gray-600 hover:bg-gray-500 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  >
                    ▲
                  </button>
                  <div className="text-5xl font-bold">{sessionCounter}</div>
                  <button
                    onClick={() => setSessionCounter(sessionCounter + 1)}
                    className="bg-gray-600 hover:bg-gray-500 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  >
                    ▼
                  </button>
                </div>
                
                <button
                  onClick={() => setSessionCounter(0)}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm"
                >
                  RESET
                </button>
              </div>

              {/* Daily Goals */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-center font-bold mb-4">DAILY GOALS <span className="text-xs text-gray-400">MIN</span></h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Profit Target</span>
                    <input
                      type="number"
                      value={profitTarget}
                      onChange={(e) => setProfitTarget(parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-16 text-right text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Daily Goal Format</span>
                    <input
                      type="text"
                      value="%"
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-12 text-center text-sm"
                      readOnly
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Sessions Required</span>
                    <input
                      type="number"
                      value={sessionsRequired}
                      onChange={(e) => setSessionsRequired(parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border border-gray-600 text-white p-1 rounded w-16 text-right text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Panel */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-center font-bold mb-4">SESSION PERFORMANCE</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Events Won</span>
                    <span>{winTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Events Lost</span>
                    <span>{totalTrades - winTrades}</span>
                  </div>
                </div>
              </div>

              {/* About Panel */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="font-bold mb-4">ABOUT</h3>
                <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div className="text-sm mb-1">A2Sniper Trade Manager</div>
                <div className="text-xs text-gray-400">Version 3.0</div>
                <div className="text-xs text-gray-400">www.a2sniper.ai</div>
                <div className="text-xs text-gray-400">© A2Sniper Alliance</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}