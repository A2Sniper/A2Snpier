'use client';

'use client';

'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  onClose: () => void;
}

export function TradingViewChart({ symbol, onClose }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Nettoyer le conteneur
      containerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `FX_IDC:${symbol.replace('/', '')}`,
        interval: '1',
        timezone: 'Europe/Paris',
        theme: 'dark',
        style: '1',
        locale: 'fr',
        toolbar_bg: '#1e293b',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart',
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies',
          'BB@tv-basicstudies'
        ],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        backgroundColor: '#1e293b',
        gridColor: '#334155',
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        support_host: 'https://www.tradingview.com'
      });

      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] relative">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">
            Graphique {symbol}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="w-full h-full">
        <div className="p-4 h-full">
          <div 
            ref={containerRef}
            className="tradingview-widget-container h-full"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
  )
}
  )
}