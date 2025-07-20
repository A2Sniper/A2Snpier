'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TradingViewChartProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewChart({ isOpen, onClose, symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        initChart();
      };
      document.head.appendChild(script);
    } else {
      initChart();
    }

    function initChart() {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `FX:${symbol.replace('/', '')}`,
          interval: '5',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'fr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ]
        });
      }
    }
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
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 h-full">
          <div 
            ref={containerRef}
            id={`tradingview_${symbol.replace('/', '_')}`}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}