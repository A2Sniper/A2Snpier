'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TradingViewChartProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

export function TradingViewChart({ isOpen, onClose, symbol }: TradingViewChartProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Créer le script TradingView
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.replace('/', ''),
      interval: "5",
      timezone: "Europe/Paris",
      theme: "light",
      style: "1",
      locale: "fr",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview_chart"
    });

    // Nettoyer le conteneur existant
    const container = document.getElementById('tradingview_chart');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isOpen, symbol]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Graphique {symbol}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4 h-full">
          <div 
            id="tradingview_chart" 
            className="w-full h-full bg-gray-50 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
  );
}