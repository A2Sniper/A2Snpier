'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Candlestick {
  id: string;
  height: number;
  width: number;
  x: number;
  y: number;
  type: 'green' | 'red';
  wickTop: number;
  wickBottom: number;
}

export function CandlestickAnimation() {
  const [candlesticks, setCandlesticks] = useState<Candlestick[]>([]);

  useEffect(() => {
    const generateCandlesticks = () => {
      const newCandlesticks: Candlestick[] = [];
      
      for (let i = 0; i < 20; i++) {
        newCandlesticks.push({
          id: `candle-${i}`,
          height: Math.random() * 40 + 10,
          width: Math.random() * 8 + 4,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          type: Math.random() > 0.5 ? 'green' : 'red',
          wickTop: Math.random() * 15 + 5,
          wickBottom: Math.random() * 15 + 5
        });
      }
      
      setCandlesticks(newCandlesticks);
    };

    generateCandlesticks();
    const interval = setInterval(generateCandlesticks, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {candlesticks.map((candle, index) => (
        <motion.div
          key={candle.id}
          className="absolute"
          style={{
            left: candle.x,
            top: candle.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.3, 
            scale: 1,
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            delay: index * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {/* Mèche supérieure */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 bg-gray-400"
            style={{
              width: '1px',
              height: candle.wickTop,
              top: -candle.wickTop
            }}
          />
          
          {/* Corps de la bougie */}
          <div
            className={`${
              candle.type === 'green' ? 'candlestick-green' : 'candlestick-red'
            } rounded-sm shadow-lg`}
            style={{
              width: candle.width,
              height: candle.height,
            }}
          />
          
          {/* Mèche inférieure */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 bg-gray-400"
            style={{
              width: '1px',
              height: candle.wickBottom,
              bottom: -candle.wickBottom
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}