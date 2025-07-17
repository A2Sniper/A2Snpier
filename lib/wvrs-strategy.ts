// Wick + Volume Rejection Strategy (WVRS) - "Mèche institutionnelle"
// Stratégie basée sur le rejet brutal du prix avec validation volumique

export interface CandleData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WVRSSignal {
  id: string;
  timestamp: Date;
  direction: 'BUY' | 'SELL';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  expiration_minutes: number;
  wick_percentage: number;
  volume_ratio: number;
  context_zone?: 'SUPPORT' | 'RESISTANCE' | 'FIBONACCI' | 'EMA';
  confirmation_status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  reasoning: string[];
}

export interface WVRSConfig {
  min_wick_percentage: number; // Minimum 60%
  min_volume_multiplier: number; // Minimum 1.5x
  volume_sma_period: number; // 10 bougies
  timeframes: string[];
  risk_reward_ratios: {
    tp1: number; // 1:1
    tp2: number; // 1:2
  };
  binary_options: {
    enabled: boolean;
    expiration_candles: number; // 1-3 bougies
  };
}

export class WVRSAnalyzer {
  private config: WVRSConfig;

  constructor(config?: Partial<WVRSConfig>) {
    this.config = {
      min_wick_percentage: 60,
      min_volume_multiplier: 1.5,
      volume_sma_period: 10,
      timeframes: ['M1', 'M5', 'M15', 'H1', 'H4'],
      risk_reward_ratios: {
        tp1: 1.0,
        tp2: 2.0
      },
      binary_options: {
        enabled: true,
        expiration_candles: 2
      },
      ...config
    };
  }

  // Analyse principale de la stratégie WVRS
  analyzeWVRS(candles: CandleData[], timeframe: string = 'M5'): WVRSSignal | null {
    if (candles.length < this.config.volume_sma_period + 2) {
      return null;
    }

    const currentCandle = candles[candles.length - 1];
    const previousCandles = candles.slice(0, -1);

    // 1. Analyser la structure de la bougie
    const candleStructure = this.analyzeCandleStructure(currentCandle);
    if (!candleStructure.hasSignificantWick) {
      return null;
    }

    // 2. Valider le volume
    const volumeAnalysis = this.analyzeVolume(candles);
    if (!volumeAnalysis.isVolumeElevated) {
      return null;
    }

    // 3. Détecter le contexte (zones clés)
    const contextZone = this.detectContextZone(candles);

    // 4. Générer le signal
    const signal = this.generateWVRSSignal(
      currentCandle,
      candleStructure,
      volumeAnalysis,
      contextZone,
      timeframe
    );

    // 5. Calculer la confiance
    signal.confidence = this.calculateConfidence(
      candleStructure,
      volumeAnalysis,
      contextZone,
      timeframe
    );

    return signal;
  }

  // Analyse de la structure de la bougie
  private analyzeCandleStructure(candle: CandleData): {
    hasSignificantWick: boolean;
    wickDirection: 'UPPER' | 'LOWER' | null;
    wickPercentage: number;
    bodySize: number;
    totalRange: number;
  } {
    const { open, high, low, close } = candle;
    const totalRange = high - low;
    const bodySize = Math.abs(close - open);
    
    // Calculer les mèches
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;
    
    // Déterminer la mèche dominante
    let wickDirection: 'UPPER' | 'LOWER' | null = null;
    let wickSize = 0;
    
    if (upperWick > lowerWick && upperWick > bodySize) {
      wickDirection = 'UPPER';
      wickSize = upperWick;
    } else if (lowerWick > upperWick && lowerWick > bodySize) {
      wickDirection = 'LOWER';
      wickSize = lowerWick;
    }
    
    const wickPercentage = totalRange > 0 ? (wickSize / totalRange) * 100 : 0;
    const hasSignificantWick = wickPercentage >= this.config.min_wick_percentage;
    
    return {
      hasSignificantWick,
      wickDirection,
      wickPercentage,
      bodySize,
      totalRange
    };
  }

  // Analyse du volume
  private analyzeVolume(candles: CandleData[]): {
    isVolumeElevated: boolean;
    volumeRatio: number;
    volumeSMA: number;
    currentVolume: number;
  } {
    const currentCandle = candles[candles.length - 1];
    const previousCandle = candles[candles.length - 2];
    const volumeHistory = candles.slice(-this.config.volume_sma_period - 1, -1);
    
    // Calculer la moyenne mobile du volume
    const volumeSMA = volumeHistory.reduce((sum, candle) => sum + candle.volume, 0) / volumeHistory.length;
    
    // Vérifier les conditions de volume
    const volumeVsSMA = currentCandle.volume > volumeSMA;
    const volumeVsPrevious = currentCandle.volume >= (previousCandle.volume * this.config.min_volume_multiplier);
    
    const isVolumeElevated = volumeVsSMA || volumeVsPrevious;
    const volumeRatio = volumeSMA > 0 ? currentCandle.volume / volumeSMA : 1;
    
    return {
      isVolumeElevated,
      volumeRatio,
      volumeSMA,
      currentVolume: currentCandle.volume
    };
  }

  // Détection des zones de contexte
  private detectContextZone(candles: CandleData[]): 'SUPPORT' | 'RESISTANCE' | 'FIBONACCI' | 'EMA' | null {
    const currentPrice = candles[candles.length - 1].close;
    const recentCandles = candles.slice(-20); // 20 dernières bougies
    
    // Détecter support/résistance basique
    const highs = recentCandles.map(c => c.high);
    const lows = recentCandles.map(c => c.low);
    
    const resistance = Math.max(...highs);
    const support = Math.min(...lows);
    
    const priceRange = resistance - support;
    const tolerance = priceRange * 0.02; // 2% de tolérance
    
    // Vérifier si le prix est proche d'une zone clé
    if (Math.abs(currentPrice - resistance) <= tolerance) {
      return 'RESISTANCE';
    } else if (Math.abs(currentPrice - support) <= tolerance) {
      return 'SUPPORT';
    }
    
    // Vérifier EMA (simulation)
    const ema21 = this.calculateEMA(candles.map(c => c.close), 21);
    if (Math.abs(currentPrice - ema21) <= tolerance) {
      return 'EMA';
    }
    
    return null;
  }

  // Génération du signal WVRS
  private generateWVRSSignal(
    candle: CandleData,
    structure: any,
    volume: any,
    context: any,
    timeframe: string
  ): WVRSSignal {
    const direction = structure.wickDirection === 'LOWER' ? 'BUY' : 'SELL';
    const entry_price = candle.close;
    
    // Calculer Stop Loss
    let stop_loss: number;
    if (direction === 'BUY') {
      stop_loss = candle.low - (candle.high - candle.low) * 0.1; // Sous la mèche
    } else {
      stop_loss = candle.high + (candle.high - candle.low) * 0.1; // Au-dessus de la mèche
    }
    
    // Calculer Take Profits
    const range = Math.abs(entry_price - stop_loss);
    const take_profit_1 = direction === 'BUY' ? 
      entry_price + (range * this.config.risk_reward_ratios.tp1) :
      entry_price - (range * this.config.risk_reward_ratios.tp1);
    
    const take_profit_2 = direction === 'BUY' ? 
      entry_price + (range * this.config.risk_reward_ratios.tp2) :
      entry_price - (range * this.config.risk_reward_ratios.tp2);
    
    // Expiration pour options binaires
    const expirationMinutes = this.getExpirationMinutes(timeframe);
    
    // Générer les raisons
    const reasoning = this.generateReasoning(structure, volume, context, direction);
    
    return {
      id: `wvrs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      direction,
      confidence: 0, // Sera calculé séparément
      entry_price,
      stop_loss,
      take_profit_1,
      take_profit_2,
      expiration_minutes: expirationMinutes,
      wick_percentage: structure.wickPercentage,
      volume_ratio: volume.volumeRatio,
      context_zone: context,
      confirmation_status: 'PENDING',
      reasoning
    };
  }

  // Calcul de la confiance
  private calculateConfidence(
    structure: any,
    volume: any,
    context: any,
    timeframe: string
  ): number {
    let confidence = 50; // Base
    
    // Bonus pour la mèche
    if (structure.wickPercentage >= 70) confidence += 20;
    else if (structure.wickPercentage >= 60) confidence += 15;
    
    // Bonus pour le volume
    if (volume.volumeRatio >= 2.0) confidence += 20;
    else if (volume.volumeRatio >= 1.5) confidence += 15;
    
    // Bonus pour le contexte
    if (context === 'SUPPORT' || context === 'RESISTANCE') confidence += 15;
    else if (context === 'EMA' || context === 'FIBONACCI') confidence += 10;
    
    // Bonus pour le timeframe
    if (['M5', 'M15'].includes(timeframe)) confidence += 10;
    else if (['H1', 'H4'].includes(timeframe)) confidence += 5;
    
    // Malus pour les petites mèches
    if (structure.wickPercentage < 65) confidence -= 10;
    
    return Math.max(60, Math.min(98, confidence));
  }

  // Confirmation du signal (bougie suivante)
  confirmSignal(signal: WVRSSignal, nextCandle: CandleData): WVRSSignal {
    const updatedSignal = { ...signal };
    
    if (signal.direction === 'BUY') {
      // Pour un signal d'achat, la bougie suivante doit casser le corps vers le haut
      if (nextCandle.close > signal.entry_price) {
        updatedSignal.confirmation_status = 'CONFIRMED';
        updatedSignal.confidence = Math.min(98, signal.confidence + 10);
        updatedSignal.reasoning.push('✅ Confirmation: Bougie suivante casse vers le haut');
      } else if (nextCandle.close < signal.stop_loss) {
        updatedSignal.confirmation_status = 'REJECTED';
        updatedSignal.confidence = Math.max(30, signal.confidence - 20);
        updatedSignal.reasoning.push('❌ Rejet: Stop loss touché');
      }
    } else {
      // Pour un signal de vente, la bougie suivante doit casser le corps vers le bas
      if (nextCandle.close < signal.entry_price) {
        updatedSignal.confirmation_status = 'CONFIRMED';
        updatedSignal.confidence = Math.min(98, signal.confidence + 10);
        updatedSignal.reasoning.push('✅ Confirmation: Bougie suivante casse vers le bas');
      } else if (nextCandle.close > signal.stop_loss) {
        updatedSignal.confirmation_status = 'REJECTED';
        updatedSignal.confidence = Math.max(30, signal.confidence - 20);
        updatedSignal.reasoning.push('❌ Rejet: Stop loss touché');
      }
    }
    
    return updatedSignal;
  }

  // Génération des raisons
  private generateReasoning(structure: any, volume: any, context: any, direction: string): string[] {
    const reasons: string[] = [];
    
    reasons.push(`🕯️ Mèche ${structure.wickDirection.toLowerCase()} de ${structure.wickPercentage.toFixed(1)}% détectée`);
    reasons.push(`📊 Volume ${volume.volumeRatio.toFixed(2)}x supérieur à la moyenne`);
    
    if (context) {
      reasons.push(`🎯 Zone ${context} identifiée - Rejet institutionnel probable`);
    }
    
    reasons.push(`📈 Signal ${direction} - Intervention majeure détectée`);
    
    if (structure.wickPercentage >= 70) {
      reasons.push(`⚡ Mèche extrême (>70%) - Signal très fort`);
    }
    
    if (volume.volumeRatio >= 2.0) {
      reasons.push(`🔥 Volume anormalement élevé - Confirmation institutionnelle`);
    }
    
    return reasons;
  }

  // Calcul EMA simplifié
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  // Calcul de l'expiration selon le timeframe
  private getExpirationMinutes(timeframe: string): number {
    const expirationMap: { [key: string]: number } = {
      'M1': 2,
      'M5': 10,
      'M15': 30,
      'H1': 120,
      'H4': 480
    };
    
    return expirationMap[timeframe] || 10;
  }

  // Méthode pour backtesting
  async backtestWVRS(
    historicalData: CandleData[],
    timeframe: string = 'M5'
  ): Promise<{
    totalSignals: number;
    confirmedSignals: number;
    successRate: number;
    avgConfidence: number;
    profitFactor: number;
  }> {
    const signals: WVRSSignal[] = [];
    const results: { signal: WVRSSignal; success: boolean; profit: number }[] = [];
    
    // Analyser chaque bougie
    for (let i = this.config.volume_sma_period + 1; i < historicalData.length - 1; i++) {
      const candleSlice = historicalData.slice(0, i + 1);
      const signal = this.analyzeWVRS(candleSlice, timeframe);
      
      if (signal) {
        // Confirmer avec la bougie suivante
        const nextCandle = historicalData[i + 1];
        const confirmedSignal = this.confirmSignal(signal, nextCandle);
        
        if (confirmedSignal.confirmation_status === 'CONFIRMED') {
          signals.push(confirmedSignal);
          
          // Simuler le résultat
          const success = this.simulateTradeResult(confirmedSignal, historicalData.slice(i + 1, i + 10));
          const profit = success ? 1 : -1; // Simplifié
          
          results.push({ signal: confirmedSignal, success, profit });
        }
      }
    }
    
    // Calculer les statistiques
    const totalSignals = signals.length;
    const confirmedSignals = signals.filter(s => s.confirmation_status === 'CONFIRMED').length;
    const successfulTrades = results.filter(r => r.success).length;
    const successRate = totalSignals > 0 ? (successfulTrades / totalSignals) * 100 : 0;
    const avgConfidence = totalSignals > 0 ? 
      signals.reduce((sum, s) => sum + s.confidence, 0) / totalSignals : 0;
    
    const totalProfit = results.reduce((sum, r) => sum + r.profit, 0);
    const totalLoss = Math.abs(results.filter(r => !r.success).reduce((sum, r) => sum + r.profit, 0));
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
    
    return {
      totalSignals,
      confirmedSignals,
      successRate,
      avgConfidence,
      profitFactor
    };
  }

  // Simulation simple du résultat d'un trade
  private simulateTradeResult(signal: WVRSSignal, futureCandles: CandleData[]): boolean {
    for (const candle of futureCandles) {
      if (signal.direction === 'BUY') {
        if (candle.high >= signal.take_profit_1) return true;
        if (candle.low <= signal.stop_loss) return false;
      } else {
        if (candle.low <= signal.take_profit_1) return true;
        if (candle.high >= signal.stop_loss) return false;
      }
    }
    return false; // Timeout
  }
}

// Export des types et classes
export default WVRSAnalyzer;