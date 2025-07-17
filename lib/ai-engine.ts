import { TechnicalIndicators, MarketData, TechnicalAnalysis } from './technical-indicators';
import WVRSAnalyzer, { WVRSSignal, CandleData } from './wvrs-strategy';

export interface MLFeatures {
  price_change_1m: number;
  price_change_5m: number;
  volume_ratio: number;
  volatility: number;
  trend_strength: number;
  support_resistance: number;
  market_sentiment: number;
  time_features: {
    hour: number;
    day_of_week: number;
    is_market_open: boolean;
  };
}

export interface SignalScore {
  base_probability: number;
  technical_score: number;
  ml_confidence: number;
  volume_score: number;
  trend_score: number;
  final_confidence: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AISignal {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  confidence: number;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  expiration: number;
  technical_indicators: TechnicalIndicators;
  ml_features: MLFeatures;
  signal_score: SignalScore;
  timestamp: Date;
  reasoning: string[];
}

export class AITradingEngine {
  private readonly confidenceThreshold = 75;
  private wvrsAnalyzer: WVRSAnalyzer;
  private readonly riskLevels = {
    LOW: { maxRisk: 0.02, minConfidence: 85 },
    MEDIUM: { maxRisk: 0.05, minConfidence: 75 },
    HIGH: { maxRisk: 0.10, minConfidence: 65 }
  };

  constructor() {
    this.wvrsAnalyzer = new WVRSAnalyzer({
      min_wick_percentage: 60,
      min_volume_multiplier: 1.5,
      volume_sma_period: 10,
      binary_options: {
        enabled: true,
        expiration_candles: 2
      }
    });
  }

  // Nouvelles méthodes pour conformité au document
  
  // Collecte de données marché selon spécifications
  async collectMarketData(): Promise<MarketData[]> {
    // Simulation de collecte multi-sources (Alpha Vantage, Yahoo Finance, Quandl)
    const sources = ['Alpha Vantage', 'Yahoo Finance', 'Quandl', 'WebSocket'];
    const data: MarketData[] = [];
    
    for (const source of sources) {
      // Simulation de données haute fréquence (mise à jour toutes les secondes)
      const sourceData = this.generateHighFrequencyData(source);
      data.push(...sourceData);
    }
    
    return this.normalizeAndFilter(data);
  }
  
  // Pipeline ETL selon spécifications
  private normalizeAndFilter(rawData: MarketData[]): MarketData[] {
    // 1. Extraction (ETL)
    const extracted = rawData.filter(d => d.close > 0 && d.volume > 0);
    
    // 2. Nettoyage (outliers, données manquantes)
    const cleaned = extracted.filter(d => {
      const priceChange = Math.abs(d.high - d.low) / d.close;
      return priceChange < 0.1; // Suppression des outliers > 10%
    });
    
    // 3. Normalisation (alignement des timeframes)
    const normalized = this.alignTimeframes(cleaned);
    
    return normalized;
  }
  
  // Génération de données haute fréquence
  private generateHighFrequencyData(source: string): MarketData[] {
    const data: MarketData[] = [];
    const now = Date.now();
    
    // Génération de 60 points (1 minute de données par seconde)
    for (let i = 0; i < 60; i++) {
      const timestamp = new Date(now - (60 - i) * 1000);
      const basePrice = 1.0800 + Math.random() * 0.01;
      
      data.push({
        symbol: 'EUR/USD',
        timestamp,
        open: basePrice,
        high: basePrice + Math.random() * 0.001,
        low: basePrice - Math.random() * 0.001,
        close: basePrice + (Math.random() - 0.5) * 0.001,
        volume: 1000000 + Math.random() * 500000,
        bid: basePrice - 0.0001,
        ask: basePrice + 0.0001,
        spread: 0.0002
      });
    }
    
    return data;
  }
  
  // Alignement des timeframes
  private alignTimeframes(data: MarketData[]): MarketData[] {
    // Agrégation par minute pour uniformiser les timeframes
    const minuteData = new Map<string, MarketData[]>();
    
    data.forEach(point => {
      const minute = new Date(point.timestamp);
      minute.setSeconds(0, 0);
      const key = minute.toISOString();
      
      if (!minuteData.has(key)) {
        minuteData.set(key, []);
      }
      minuteData.get(key)!.push(point);
    });
    
    // Création de bougies par minute
    const aggregated: MarketData[] = [];
    minuteData.forEach((points, timeKey) => {
      if (points.length > 0) {
        const open = points[0].open;
        const close = points[points.length - 1].close;
        const high = Math.max(...points.map(p => p.high));
        const low = Math.min(...points.map(p => p.low));
        const volume = points.reduce((sum, p) => sum + p.volume, 0);
        
        aggregated.push({
          symbol: points[0].symbol,
          timestamp: new Date(timeKey),
          open,
          high,
          low,
          close,
          volume,
          bid: close - 0.0001,
          ask: close + 0.0001,
          spread: 0.0002
        });
      }
    });
    
    return aggregated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  // Génération de signaux selon format spécifié
  generateFormattedSignal(signal: AISignal): string {
    const time = signal.timestamp.toLocaleTimeString('fr-FR');
    const direction = signal.direction;
    const expiration = signal.expiration;
    const confidence = signal.confidence;
    
    return `[${time}] – Actif: [${signal.pair}] – Direction: [${direction}] – Expiration: [${expiration} min] – Confiance: [${confidence}%]`;
  }
  
  // Calcul de signaux toutes les minutes selon spécifications
  async startSignalGeneration(callback: (signal: string) => void): Promise<void> {
    setInterval(async () => {
      try {
        const marketData = await this.collectMarketData();
        const signal = await this.generateSignal('EUR/USD', marketData);
        
        if (signal && signal.confidence >= this.confidenceThreshold) {
          const formattedSignal = this.generateFormattedSignal(signal);
          callback(formattedSignal);
        }
      } catch (error) {
        console.error('Erreur génération signal:', error);
      }
    }, 60000); // Toutes les minutes
  }

  // Simulation Random Forest
  private simulateRandomForest(features: MLFeatures): number {
    // Simulation basée sur les features
    let score = 0.5;
    
    // Analyse du momentum
    if (Math.abs(features.price_change_1m) > 0.001) {
      score += features.price_change_1m > 0 ? 0.1 : -0.1;
    }
    
    // Analyse du volume
    if (features.volume_ratio > 1.2) {
      score += 0.15;
    }
    
    // Analyse de la volatilité
    if (features.volatility > 0.02) {
      score += features.trend_strength > 0 ? 0.1 : -0.1;
    }
    
    // Facteurs temporels
    const { hour, is_market_open } = features.time_features;
    if (is_market_open && (hour >= 8 && hour <= 16)) {
      score += 0.05; // Heures de trading actives
    }
    
    return Math.max(0, Math.min(1, score));
  }

  // Simulation XGBoost
  private simulateXGBoost(features: MLFeatures, technicals: TechnicalIndicators): number {
    let score = 0.5;
    
    // Analyse RSI
    if (technicals.rsi < 30) score += 0.2; // Survente
    else if (technicals.rsi > 70) score -= 0.2; // Surachat
    
    // Analyse MACD
    if (technicals.macd.histogram > 0) score += 0.15;
    else score -= 0.15;
    
    // Analyse Bollinger Bands
    const currentPrice = features.price_change_1m + 1; // Prix relatif
    if (currentPrice < 0.95) score += 0.1; // Proche de la bande inférieure
    else if (currentPrice > 1.05) score -= 0.1; // Proche de la bande supérieure
    
    // Analyse ADX
    if (technicals.adx > 25) {
      score += features.trend_strength > 0 ? 0.1 : -0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  // Simulation LSTM
  private simulateLSTM(marketHistory: MarketData[]): number {
    if (marketHistory.length < 10) return 0.5;
    
    // Analyse des patterns temporels
    const recentPrices = marketHistory.slice(-10).map(d => d.close);
    const priceChanges = recentPrices.slice(1).map((price, i) => price - recentPrices[i]);
    
    // Détection de tendance
    const upMoves = priceChanges.filter(change => change > 0).length;
    const trendScore = upMoves / priceChanges.length;
    
    // Analyse de la volatilité récente
    const volatility = this.calculateVolatility(recentPrices);
    const volatilityScore = volatility < 0.02 ? 0.6 : 0.4;
    
    return (trendScore * 0.7) + (volatilityScore * 0.3);
  }

  // Calcul de la volatilité
  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = prices.slice(1).map((price, i) => Math.log(price / prices[i]));
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  // Extraction des features ML
  private extractMLFeatures(marketData: MarketData[]): MLFeatures {
    if (marketData.length < 10) {
      throw new Error('Données insuffisantes pour l\'analyse');
    }

    const latest = marketData[marketData.length - 1];
    const previous1m = marketData[marketData.length - 2];
    const previous5m = marketData[marketData.length - 6] || previous1m;
    
    const recentVolumes = marketData.slice(-20).map(d => d.volume);
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    
    const recentPrices = marketData.slice(-20).map(d => d.close);
    const volatility = this.calculateVolatility(recentPrices);
    
    // Calcul du trend strength
    const ema9 = TechnicalAnalysis.calculateEMA(recentPrices, 9);
    const ema21 = TechnicalAnalysis.calculateEMA(recentPrices, 21);
    const trendStrength = (ema9 - ema21) / ema21;
    
    // Support/Resistance simplifié
    const highs = marketData.slice(-50).map(d => d.high);
    const lows = marketData.slice(-50).map(d => d.low);
    const resistance = Math.max(...highs);
    const support = Math.min(...lows);
    const supportResistance = (latest.close - support) / (resistance - support);
    
    const now = new Date();
    
    return {
      price_change_1m: (latest.close - previous1m.close) / previous1m.close,
      price_change_5m: (latest.close - previous5m.close) / previous5m.close,
      volume_ratio: latest.volume / avgVolume,
      volatility,
      trend_strength: trendStrength,
      support_resistance: supportResistance,
      market_sentiment: Math.random() * 0.4 + 0.3, // Simulation sentiment
      time_features: {
        hour: now.getHours(),
        day_of_week: now.getDay(),
        is_market_open: this.isMarketOpen(now)
      }
    };
  }

  // Vérification des heures de marché
  private isMarketOpen(date: Date): boolean {
    const hour = date.getHours();
    const day = date.getDay();
    
    // Marché forex ouvert 24h/5j
    if (day === 0 || day === 6) return false; // Weekend
    if (day === 1 && hour < 1) return false; // Lundi avant 1h
    if (day === 5 && hour > 21) return false; // Vendredi après 21h
    
    return true;
  }

  // Calcul du score final
  private calculateFinalScore(scores: Omit<SignalScore, 'final_confidence' | 'risk_level'>): SignalScore {
    const weights = {
      base_probability: 0.25,
      technical_score: 0.30,
      ml_confidence: 0.25,
      volume_score: 0.15,
      trend_score: 0.05
    };
    
    const finalConfidence = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof typeof scores] * weight);
    }, 0) * 100;
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (finalConfidence >= 85) riskLevel = 'LOW';
    else if (finalConfidence < 70) riskLevel = 'HIGH';
    
    return {
      ...scores,
      final_confidence: finalConfidence,
      risk_level: riskLevel
    };
  }

  // Génération des raisons du signal
  private generateReasoning(
    technicals: TechnicalIndicators, 
    features: MLFeatures, 
    direction: 'CALL' | 'PUT',
    wvrsSignal?: WVRSSignal | null
  ): string[] {
    const reasons: string[] = [];
    
    // Raisons WVRS en priorité
    if (wvrsSignal) {
      reasons.push('🎯 WVRS Strategy - Signal institutionnel détecté');
      reasons.push(`🕯️ Mèche ${wvrsSignal.wick_percentage.toFixed(1)}% - Rejet de zone`);
      reasons.push(`📊 Volume ${wvrsSignal.volume_ratio.toFixed(2)}x - Intervention majeure`);
      if (wvrsSignal.context_zone) {
        reasons.push(`🎯 Zone ${wvrsSignal.context_zone} - Contexte favorable`);
      }
      return reasons;
    }
    
    // Analyse RSI
    if (technicals.rsi < 30) {
      reasons.push(`RSI en survente (${technicals.rsi.toFixed(1)}) - Signal d'achat potentiel`);
    } else if (technicals.rsi > 70) {
      reasons.push(`RSI en surachat (${technicals.rsi.toFixed(1)}) - Signal de vente potentiel`);
    }
    
    // Analyse MACD
    if (technicals.macd.histogram > 0) {
      reasons.push('MACD au-dessus de la ligne de signal - Momentum haussier');
    } else {
      reasons.push('MACD en-dessous de la ligne de signal - Momentum baissier');
    }
    
    // Analyse du volume
    if (features.volume_ratio > 1.5) {
      reasons.push(`Volume élevé (${(features.volume_ratio * 100).toFixed(0)}% de la moyenne) - Confirmation du mouvement`);
    }
    
    // Analyse de tendance
    if (Math.abs(features.trend_strength) > 0.01) {
      const trendDirection = features.trend_strength > 0 ? 'haussière' : 'baissière';
      reasons.push(`Tendance ${trendDirection} confirmée par les EMA`);
    }
    
    // Analyse ADX
    if (technicals.adx > 25) {
      reasons.push(`Force de tendance élevée (ADX: ${technicals.adx.toFixed(1)}) - Mouvement directionnel fort`);
    }
    
    return reasons;
  }

  // Génération d'un signal AI complet avec WVRS
  async generateSignal(pair: string, marketData: MarketData[]): Promise<AISignal | null> {
    try {
      // 1. Analyser avec la stratégie WVRS d'abord
      const wvrsSignal = await this.analyzeWithWVRS(marketData);
      
      // Extraction des features et indicateurs
      const mlFeatures = this.extractMLFeatures(marketData);
      const technicals = TechnicalAnalysis.analyzeMarket(marketData);
      
      // Si WVRS détecte un signal fort, l'utiliser comme base
      if (wvrsSignal && wvrsSignal.confidence >= 85) {
        return this.createAISignalFromWVRS(pair, wvrsSignal, mlFeatures, technicals);
      }
      
      // Calcul des scores des différents modèles
      const rfScore = this.simulateRandomForest(mlFeatures);
      const xgbScore = this.simulateXGBoost(mlFeatures, technicals);
      const lstmScore = this.simulateLSTM(marketData);
      
      // Bonus si WVRS détecte des patterns même avec confiance plus faible
      let wvrsBonus = 0;
      if (wvrsSignal) {
        wvrsBonus = (wvrsSignal.confidence / 100) * 0.2; // Bonus jusqu'à 20%
      }
      
      // Scores techniques
      const technicalScore = this.calculateTechnicalScore(technicals);
      const volumeScore = Math.min(1, mlFeatures.volume_ratio / 2);
      const trendScore = Math.abs(mlFeatures.trend_strength) * 10;
      
      // Score final avec bonus WVRS
      const signalScore = this.calculateFinalScore({
        base_probability: Math.min(1, (rfScore + xgbScore + lstmScore) / 3 + wvrsBonus),
        technical_score: technicalScore,
        ml_confidence: Math.max(rfScore, xgbScore, lstmScore),
        volume_score: volumeScore,
        trend_score: trendScore
      });
      
      // Ajuster la confiance si WVRS est présent
      if (wvrsSignal) {
        signalScore.final_confidence = Math.min(98, signalScore.final_confidence + 10);
      }
      
      // Filtrage par seuil de confiance
      if (signalScore.final_confidence < this.confidenceThreshold) {
        return null;
      }
      
      // Détermination de la direction (WVRS prioritaire)
      const direction: 'CALL' | 'PUT' = wvrsSignal ? 
        (wvrsSignal.direction === 'BUY' ? 'CALL' : 'PUT') :
        (signalScore.base_probability > 0.5 ? 'CALL' : 'PUT');
      
      // Calcul des prix cibles (WVRS prioritaire)
      const currentPrice = marketData[marketData.length - 1].close;
      
      let targetPrice: number;
      let stopLoss: number;
      
      if (wvrsSignal) {
        targetPrice = wvrsSignal.take_profit_1;
        stopLoss = wvrsSignal.stop_loss;
      } else {
        const volatility = mlFeatures.volatility;
        const targetDistance = volatility * 2;
        const stopDistance = volatility * 1.5;
        
        targetPrice = direction === 'CALL' ? 
          currentPrice * (1 + targetDistance) : 
          currentPrice * (1 - targetDistance);
        
        stopLoss = direction === 'CALL' ? 
          currentPrice * (1 - stopDistance) : 
          currentPrice * (1 + stopDistance);
      }
      
      // Génération du signal
      const signal: AISignal = {
        id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pair,
        direction,
        confidence: Math.round(signalScore.final_confidence),
        entry_price: currentPrice,
        target_price: targetPrice,
        stop_loss: stopLoss,
        expiration: this.calculateExpiration(signalScore.final_confidence),
        technical_indicators: technicals,
        ml_features: mlFeatures,
        signal_score: signalScore,
        timestamp: new Date(),
        reasoning: this.generateReasoning(technicals, mlFeatures, direction, wvrsSignal)
      };
      
      return signal;
    } catch (error) {
      console.error('Erreur lors de la génération du signal:', error);
      return null;
    }
  }

  // Analyse avec la stratégie WVRS
  private async analyzeWithWVRS(marketData: MarketData[]): Promise<WVRSSignal | null> {
    // Convertir MarketData en CandleData
    const candleData: CandleData[] = marketData.map(data => ({
      timestamp: data.timestamp,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      volume: data.volume
    }));
    
    return this.wvrsAnalyzer.analyzeWVRS(candleData, 'M5');
  }
  
  // Créer un signal AI à partir d'un signal WVRS
  private createAISignalFromWVRS(
    pair: string,
    wvrsSignal: WVRSSignal,
    mlFeatures: MLFeatures,
    technicals: TechnicalIndicators
  ): AISignal {
    const direction: 'CALL' | 'PUT' = wvrsSignal.direction === 'BUY' ? 'CALL' : 'PUT';
    
    // Score basé sur WVRS
    const signalScore = {
      base_probability: wvrsSignal.confidence / 100,
      technical_score: 0.9, // WVRS est technique
      ml_confidence: wvrsSignal.confidence / 100,
      volume_score: Math.min(1, wvrsSignal.volume_ratio / 2),
      trend_score: 0.8,
      final_confidence: wvrsSignal.confidence,
      risk_level: wvrsSignal.confidence >= 90 ? 'LOW' as const : 
                  wvrsSignal.confidence >= 80 ? 'MEDIUM' as const : 'HIGH' as const
    };
    
    return {
      id: wvrsSignal.id,
      pair,
      direction,
      confidence: Math.round(wvrsSignal.confidence),
      entry_price: wvrsSignal.entry_price,
      target_price: wvrsSignal.take_profit_1,
      stop_loss: wvrsSignal.stop_loss,
      expiration: wvrsSignal.expiration_minutes,
      technical_indicators: technicals,
      ml_features: mlFeatures,
      signal_score: signalScore,
      timestamp: wvrsSignal.timestamp,
      reasoning: [
        '🎯 WVRS Strategy - Mèche institutionnelle détectée',
        ...wvrsSignal.reasoning,
        `📊 Confiance WVRS: ${wvrsSignal.confidence}%`,
        `🕯️ Mèche: ${wvrsSignal.wick_percentage.toFixed(1)}%`,
        `📈 Volume: ${wvrsSignal.volume_ratio.toFixed(2)}x`,
        wvrsSignal.context_zone ? `🎯 Zone: ${wvrsSignal.context_zone}` : ''
      ].filter(Boolean)
    };
  }

  // Calcul du score technique
  private calculateTechnicalScore(technicals: TechnicalIndicators): number {
    let score = 0.5;
    
    // RSI
    if (technicals.rsi < 30) score += 0.2;
    else if (technicals.rsi > 70) score -= 0.2;
    else if (technicals.rsi >= 40 && technicals.rsi <= 60) score += 0.1;
    
    // MACD
    if (technicals.macd.histogram > 0) score += 0.15;
    else score -= 0.15;
    
    // Bollinger Bands (simulation)
    const bbPosition = 0.5; // Position dans les bandes (simplifié)
    if (bbPosition < 0.2) score += 0.1;
    else if (bbPosition > 0.8) score -= 0.1;
    
    // EMA
    if (technicals.ema.ema9 > technicals.ema.ema21) score += 0.1;
    else score -= 0.1;
    
    // ADX
    if (technicals.adx > 25) score += 0.05;
    
    return Math.max(0, Math.min(1, score));
  }

  // Calcul de l'expiration optimale
  private calculateExpiration(confidence: number): number {
    if (confidence >= 90) return 1; // 1 minute pour haute confiance
    if (confidence >= 80) return 3; // 3 minutes
    if (confidence >= 75) return 5; // 5 minutes
    return 5; // Par défaut
  }

  // Validation du signal
  validateSignal(signal: AISignal): boolean {
    // Vérifications de base
    if (signal.confidence < this.confidenceThreshold) return false;
    if (!signal.pair || !signal.direction) return false;
    if (signal.entry_price <= 0) return false;
    
    // Vérification des niveaux de risque
    const riskConfig = this.riskLevels[signal.signal_score.risk_level];
    if (signal.confidence < riskConfig.minConfidence) return false;
    
    // Vérification de la cohérence des prix
    const priceRange = Math.abs(signal.target_price - signal.entry_price) / signal.entry_price;
    if (priceRange > 0.1) return false; // Mouvement trop important
    
    return true;
  }
}