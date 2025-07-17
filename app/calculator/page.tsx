'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { useAppStore } from '@/lib/store';

interface Trade {
  result: string;
  amount: number;
  return: number;
  balance: number;
}

export default function CalculatorPage() {
  const { isAuthenticated } = useAppStore();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [sessionCounter, setSessionCounter] = useState(0);
  const [initialCapital, setInitialCapital] = useState(3750.74);
  const [payoutPercent, setPayoutPercent] = useState(92);
  const [maxLossLimit, setMaxLossLimit] = useState(10);
  const [profitTarget, setProfitTarget] = useState(2);
  const [sessionsRequired, setSessionsRequired] = useState(1);

  // Initialize trades array
  useEffect(() => {
    const initialTrades: Trade[] = [];
    for (let i = 0; i < 20; i++) {
      initialTrades[i] = { result: '', amount: 0, return: 0, balance: 0 };
    }
    setTrades(initialTrades);
  }, []);

  const updateTrade = (index: number, field: string, value: string | number) => {
    const newTrades = [...trades];
    if (field === 'result') {
      newTrades[index].result = value as string;
    } else if (field === 'amount') {
      newTrades[index].amount = parseFloat(value as string) || 0;
    } else if (field === 'return') {
      newTrades[index].return = parseFloat(value as string) || 0;
    }
    setTrades(newTrades);
    updateBalances(newTrades);
  };

  const updateBalances = (tradesArray: Trade[]) => {
    let currentBalance = initialCapital;
    
    for (let i = 0; i < tradesArray.length; i++) {
      if (tradesArray[i].result && tradesArray[i].amount > 0) {
        if (tradesArray[i].result === 'win') {
          currentBalance += tradesArray[i].return;
        } else if (tradesArray[i].result === 'loss') {
          currentBalance -= tradesArray[i].amount;
        }
      }
      tradesArray[i].balance = currentBalance;
    }
    setTrades([...tradesArray]);
  };

  const clearTrades = () => {
    const clearedTrades: Trade[] = [];
    for (let i = 0; i < 20; i++) {
      clearedTrades[i] = { result: '', amount: 0, return: 0, balance: 0 };
    }
    setTrades(clearedTrades);
  };

  const newSession = () => {
    clearTrades();
    setSessionCounter(0);
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Nouvelle session créée !';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const changeCounter = (direction: number) => {
    const newCounter = sessionCounter + direction;
    if (newCounter >= 0) {
      setSessionCounter(newCounter);
    }
  };

  const resetCounter = () => {
    setSessionCounter(0);
  };

  // Calculate statistics
  const totalTrades = trades.filter(t => t.result && t.amount > 0).length;
  const winTrades = trades.filter(t => t.result === 'win' && t.amount > 0).length;
  const totalProfit = trades.reduce((sum, t) => t.result === 'win' ? sum + t.return : sum, 0);
  const totalLoss = trades.reduce((sum, t) => t.result === 'loss' ? sum + t.amount : sum, 0);
  const finalCapital = initialCapital + totalProfit - totalLoss;
  const accountGain = ((finalCapital - initialCapital) / initialCapital * 100);
  const stopLoss = initialCapital * 0.8;
  const eventsWon = winTrades;
  const eventsLost = totalTrades - winTrades;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès Restreint</h1>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder au calculateur</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      <div className="md:pl-64">
        <div className="min-w-[1200px] p-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-800 to-gray-700 text-center p-4 mb-5 rounded-md"
          >
            <h1 className="text-2xl font-bold tracking-wider text-white">
              A2SNIPER TRADE MANAGER
            </h1>
          </motion.div>

          <div className="grid grid-cols-[1fr_350px] gap-5">
            {/* Trades Section */}
            <div className="bg-gray-800 rounded-md p-5">
              <div className="grid grid-cols-[50px_80px_120px_80px_120px] gap-2.5 bg-gray-700 p-2.5 mb-2.5 rounded-sm font-bold text-xs text-white">
                <div>NO.</div>
                <div>RESULT</div>
                <div>TRADE AMOUNT</div>
                <div>RETURN</div>
                <div>CURRENT BALANCE</div>
              </div>
              
              <div className="space-y-0">
                {trades.map((trade, index) => (
                  <div key={index} className="grid grid-cols-[50px_80px_120px_80px_120px] gap-2.5 p-2 border-b border-gray-600 text-xs hover:bg-gray-700">
                    <div className="text-white">{index + 1}</div>
                    <div>
                      <select
                        value={trade.result}
                        onChange={(e) => updateTrade(index, 'result', e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm text-xs w-full"
                      >
                        <option value="">-</option>
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="$0.00"
                        value={trade.amount || ''}
                        onChange={(e) => updateTrade(index, 'amount', e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm text-xs w-full"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="$0.00"
                        value={trade.return || ''}
                        onChange={(e) => updateTrade(index, 'return', e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm text-xs w-full"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                        {trade.result && trade.amount > 0 ? `$${trade.balance.toFixed(2)}` : '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearTrades}
                className="bg-gray-600 text-white border-none p-2 mt-2.5 rounded-sm cursor-pointer text-xs hover:bg-gray-500"
              >
                CLEAR
              </button>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              {/* New Session Button */}
              <button
                onClick={newSession}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black border-none p-4 rounded-md font-bold cursor-pointer hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                + NEW SESSION
              </button>

              {/* Calculations Panel */}
              <div className="bg-gray-800 rounded-md p-5">
                <div className="text-center font-bold mb-4 pb-2.5 border-b border-gray-600 text-white">
                  CALCULATIONS
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Initial Capital</span>
                    <input
                      type="number"
                      value={initialCapital}
                      onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-20 text-right text-xs"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Total Trades</span>
                    <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      {totalTrades}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Win Trades</span>
                    <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      {winTrades}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Payout %</span>
                    <input
                      type="number"
                      value={payoutPercent}
                      onChange={(e) => setPayoutPercent(parseFloat(e.target.value) || 0)}
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-20 text-right text-xs"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Currency</span>
                    <select className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm text-xs">
                      <option>USD ($)</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Capital Final</span>
                    <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      ${finalCapital.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Account Gain</span>
                    <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      {accountGain.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Win Profit</span>
                    <div className="bg-green-700 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      ${totalProfit.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Stop Loss</span>
                    <div className="bg-gray-900 p-1 rounded-sm min-w-[80px] text-right border border-gray-600 text-white">
                      ${stopLoss.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700 text-xs">
                    <span className="text-gray-300">Max Loss Limit</span>
                    <input
                      type="number"
                      value={maxLossLimit}
                      onChange={(e) => setMaxLossLimit(parseFloat(e.target.value) || 0)}
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-20 text-right text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Session Controls */}
              <div className="bg-gray-800 p-4 rounded-md text-center">
                <div className="text-xs mb-2.5 text-gray-300">LOG SESSION</div>
                <div className="text-xs mb-2.5 text-gray-300">SESSION COUNTER</div>
                
                <div className="flex justify-center items-center gap-2.5 mb-5">
                  <button
                    onClick={() => changeCounter(-1)}
                    className="bg-gray-600 text-white border-none w-10 h-10 rounded-md cursor-pointer text-lg flex items-center justify-center hover:bg-gray-500"
                  >
                    ▲
                  </button>
                  <div className="text-5xl font-bold my-5 text-white">
                    {sessionCounter}
                  </div>
                  <button
                    onClick={() => changeCounter(1)}
                    className="bg-gray-600 text-white border-none w-10 h-10 rounded-md cursor-pointer text-lg flex items-center justify-center hover:bg-gray-500"
                  >
                    ▼
                  </button>
                </div>
                
                <button
                  onClick={resetCounter}
                  className="bg-gray-600 text-white border-none p-2 rounded-sm cursor-pointer text-xs hover:bg-gray-500"
                >
                  RESET
                </button>
              </div>

              {/* Daily Goals */}
              <div className="bg-gray-800 p-4 rounded-md">
                <div className="text-center font-bold mb-4 text-white">
                  DAILY GOALS <span className="text-xs text-gray-400">MIN</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1 text-xs">
                    <span className="text-gray-300">Profit Target</span>
                    <input
                      type="number"
                      value={profitTarget}
                      onChange={(e) => setProfitTarget(parseFloat(e.target.value) || 0)}
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-15 text-right text-xs"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-1 text-xs">
                    <span className="text-gray-300">Daily Goal Format</span>
                    <input
                      type="text"
                      value="%"
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-10 text-right text-xs"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-1 text-xs">
                    <span className="text-gray-300">Sessions Required</span>
                    <input
                      type="number"
                      value={sessionsRequired}
                      onChange={(e) => setSessionsRequired(parseFloat(e.target.value) || 0)}
                      className="bg-gray-900 border border-gray-600 text-white p-1 rounded-sm w-15 text-right text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Panel */}
              <div className="bg-gray-800 p-4 rounded-md">
                <div className="text-center font-bold mb-4 text-white">SESSION PERFORMANCE</div>
                
                <div className="space-y-1">
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-300">Events Won</span>
                    <span className="text-white">{eventsWon}</span>
                  </div>
                  
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-300">Events Lost</span>
                    <span className="text-white">{eventsLost}</span>
                  </div>
                </div>
              </div>

              {/* About Panel */}
              <div className="bg-gray-800 p-4 rounded-md text-center">
                <div className="text-center font-bold mb-4 text-white">ABOUT</div>
                <div className="w-15 h-15 bg-gray-600 rounded-full mx-auto mb-2.5 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div className="text-xs mb-1 text-gray-300">A2Sniper Trade Manager</div>
                <div className="text-xs text-gray-400">Version 3.0</div>
                <div className="text-xs text-gray-400">www.a2sniper.ai</div>
                <div className="text-xs text-gray-400">© A2Sniper Alliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}